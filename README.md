# FoodOrder — Promise Chains

> Практична робота 10.1 · Варіант 1 · Promises та ланцюжки промісів

## Опис

Система обробки замовлення їжі через ланцюжки промісів. Кожен етап — окремий Promise з симуляцією затримки та 20% шансом випадкової помилки.

## Запуск

```bash
start index.html   # Windows
open index.html    # macOS
```

---

## Етапи обробки

### 1. `checkAvailability(orderId)` — затримка 1с
```js
checkAvailability('ORD-001')
  .then(result => console.log(result));
// → { orderId, items, amount }
```

### 2. `reserveItems(data)` — затримка 1с
```js
.then(result => reserveItems(result))
// → { ...data, reservedAt }
```

### 3. `processPayment(data)` — затримка 1.5с
```js
.then(result => processPayment(result))
// → { ...data, transactionId, paidAt }
```

### 4. `scheduleDelivery(data)` — затримка 1с
```js
.then(result => scheduleDelivery(result))
// → { ...data, courier, eta }
```

---

## Повний ланцюжок

```js
checkAvailability(orderId)
  .then(result => {
    log('Наявність підтверджена');
    return reserveItems(result);
  })
  .then(result => {
    log('Товари зарезервовано');
    return processPayment(result);
  })
  .then(result => {
    log('Оплата прийнята');
    return scheduleDelivery(result);
  })
  .then(result => {
    log('Доставку заплановано ✓');
  })
  .catch(err => {
    // Централізована обробка помилок будь-якого етапу
    log(`Помилка: ${err.message}`);
  })
  .finally(() => {
    // Завжди виконується — очищення стану
    setLoading(false);
  });
```

---

## Обробка помилок

- Кожна функція має **20% шанс** кинути помилку
- Помилка будь-якого етапу потрапляє до централізованого `.catch()`
- `.finally()` виконується завжди — скидає стан UI
- Повідомлення про помилку відображається у banner та логу

---

## Demo відео

> https://github.com/imenshov-ctrl/js-promises-variant1/blob/main/FoodOrder%20%E2%80%94%20Promise%20Chains%20Demo%20-%20Google%20Chrome%202026-04-28%2020-13-48.mp4

---

## Критерії оцінювання

| Критерій | Бали | Статус |
|----------|------|--------|
| Коректність Promise | 2 | ✅ нативні Promise, resolve/reject |
| Ланцюжки промісів | 2 | ✅ .then().then().then() |
| Обробка помилок | 2 | ✅ .catch() централізований, .finally() |
| Статичні методи | 2 | ✅ Promise.resolve в delay utility |
| Якість коду та демо | 2 | ✅ логування, UI, README |
| **Всього** | **10** | |
