/**
 * @fileoverview Практична робота 10.1 — Promises та ланцюжки промісів
 * Варіант 1: Система замовлення їжі
 *
 * Кожна функція повертає Promise.
 * 20% шанс випадкової помилки на кожному етапі.
 * Обробка помилок через централізований .catch().
 * Фінальне очищення через .finally().
 */

// ── Утиліти ───────────────────────────────────────────────────

/**
 * Затримка через Promise
 * @param {number} ms
 * @returns {Promise<void>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Симуляція випадкової помилки (20% шанс)
 * @param {string} stage — назва етапу для повідомлення про помилку
 * @returns {boolean} — true якщо помилка
 */
const shouldFail = stage => {
  if (Math.random() < 0.2) {
    throw new Error(`[${stage}] Помилка сервісу — спробуйте ще раз`);
  }
  return false;
};

// ── Кастомні помилки ─────────────────────────────────────────

class OrderError extends Error {
  constructor(stage, message) {
    super(message);
    this.name  = 'OrderError';
    this.stage = stage;
  }
}

// ═══════════════════════════════════════════════════════════════
//  Етапи обробки замовлення
// ═══════════════════════════════════════════════════════════════

/**
 * 1. Перевірка наявності товарів
 * @param {string} orderId
 * @returns {Promise<{ orderId, items, amount }>}
 */
function checkAvailability(orderId) {
  return new Promise((resolve, reject) => {
    delay(1000).then(() => {
      try {
        shouldFail('checkAvailability');
        resolve({
          orderId,
          items:  ['Піца Маргарита', 'Coca-Cola', 'Тірамісу'],
          amount: 485,
          stage:  'availability',
        });
      } catch (e) {
        reject(new OrderError('checkAvailability', e.message));
      }
    });
  });
}

/**
 * 2. Резервування товарів
 * @param {{ orderId, items, amount }} data
 * @returns {Promise<{ orderId, items, amount, reservedAt }>}
 */
function reserveItems(data) {
  return new Promise((resolve, reject) => {
    delay(1000).then(() => {
      try {
        shouldFail('reserveItems');
        resolve({
          ...data,
          reservedAt: new Date().toLocaleTimeString('uk-UA'),
          stage: 'reserved',
        });
      } catch (e) {
        reject(new OrderError('reserveItems', e.message));
      }
    });
  });
}

/**
 * 3. Обробка оплати
 * @param {{ orderId, amount }} data
 * @returns {Promise<{ orderId, amount, transactionId, paidAt }>}
 */
function processPayment(data) {
  return new Promise((resolve, reject) => {
    delay(1500).then(() => {
      try {
        shouldFail('processPayment');
        resolve({
          ...data,
          transactionId: 'TXN-' + Math.random().toString(36).slice(2, 10).toUpperCase(),
          paidAt: new Date().toLocaleTimeString('uk-UA'),
          stage: 'paid',
        });
      } catch (e) {
        reject(new OrderError('processPayment', e.message));
      }
    });
  });
}

/**
 * 4. Планування доставки
 * @param {{ orderId, transactionId }} data
 * @returns {Promise<{ orderId, transactionId, courier, eta }>}
 */
function scheduleDelivery(data) {
  return new Promise((resolve, reject) => {
    delay(1000).then(() => {
      try {
        shouldFail('scheduleDelivery');
        const eta = new Date(Date.now() + 30 * 60 * 1000)
          .toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        resolve({
          ...data,
          courier: 'Олег К.',
          eta,
          stage: 'delivered',
        });
      } catch (e) {
        reject(new OrderError('scheduleDelivery', e.message));
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  Головний ланцюжок
// ═══════════════════════════════════════════════════════════════

/**
 * Запускає повний ланцюжок обробки замовлення.
 *
 * @param {string} orderId
 * @param {{ onStep: Function, onDone: Function, onError: Function, onFinally: Function }} callbacks
 */
function processOrder(orderId, { onStep, onDone, onError, onFinally }) {
  let isActive = true; // прапор для finally

  checkAvailability(orderId)
    .then(result => {
      onStep('checkAvailability', result);
      return reserveItems(result);
    })
    .then(result => {
      onStep('reserveItems', result);
      return processPayment(result);
    })
    .then(result => {
      onStep('processPayment', result);
      return scheduleDelivery(result);
    })
    .then(result => {
      onStep('scheduleDelivery', result);
      onDone(result);
    })
    .catch(err => {
      // Централізована обробка всіх помилок ланцюжка
      onError(err);
    })
    .finally(() => {
      // Завжди виконується — очищення стану
      isActive = false;
      onFinally(isActive);
    });
}

export { processOrder, checkAvailability, reserveItems, processPayment, scheduleDelivery };
