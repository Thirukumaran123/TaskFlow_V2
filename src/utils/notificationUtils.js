/**
 * Notification Utilities for TaskFlow
 * Provides Browser Notification API integration, Web Audio API chime sounds,
 * and background reminder checks.
 */

// Track notified task IDs in current session to prevent spamming
const notifiedTaskIds = new Set();

/**
 * Check if the browser supports notifications
 */
export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 * @returns {'granted' | 'denied' | 'default' | 'unsupported'}
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Request notification permission from user
 * @returns {Promise<'granted' | 'denied' | 'default'>}
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Play a gentle Web Audio synthetic chime (no external audio files needed!)
 * @param {'chime' | 'success' | 'alert'} type 
 */
export function playChimeSound(type = 'chime') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'success') {
      // Pleasant upward two-tone (e.g. task completed)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5

      osc1.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.4);
    } else if (type === 'alert') {
      // Urgent reminder tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.setValueAtTime(440, now + 0.15); // A4
      osc.frequency.setValueAtTime(880, now + 0.3); // A5

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      // Default notification chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio context might be restricted before user gesture
    console.debug('Web Audio playback deferred or unavailable:', e);
  }
}

/**
 * Show a browser notification if permitted
 * @param {string} title 
 * @param {Object} options 
 */
export function sendNotification(title, options = {}) {
  if (!isNotificationSupported()) return;

  if (Notification.permission === 'granted') {
    try {
      const n = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options
      });

      // Auto close after 7 seconds
      setTimeout(() => n.close(), 7000);
    } catch (err) {
      console.warn('Notification display failed:', err);
    }
  }
}

/**
 * Check tasks for reminders that should fire right now
 * @param {Array} tasks 
 * @param {Function} onTriggerReminder 
 */
export function checkTaskReminders(tasks, onTriggerReminder) {
  if (!Array.isArray(tasks)) return;

  const now = new Date();
  const currentMinutes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  tasks.forEach(task => {
    if (task.status === 'completed') return;
    if (!task.reminderDateTime) return;

    // Normalize reminder to YYYY-MM-DDTHH:mm
    const reminderPrefix = task.reminderDateTime.substring(0, 16);

    if (reminderPrefix === currentMinutes && !notifiedTaskIds.has(task.id)) {
      notifiedTaskIds.add(task.id);

      // Play chime
      playChimeSound('alert');

      // Dispatch browser notification
      sendNotification(`Task Reminder: ${task.title}`, {
        body: task.description || `Priority: ${task.priority.toUpperCase()} • Due: ${task.dueDate || 'Today'}`,
        tag: `task-reminder-${task.id}`
      });

      if (typeof onTriggerReminder === 'function') {
        onTriggerReminder(task);
      }
    }
  });
}
