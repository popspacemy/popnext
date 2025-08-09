# Data Handler Documentation

## Overview

The data handlers provide a set of utility functions for interacting with the database. They abstract away the complexities of database operations and provide a consistent interface for common CRUD operations. These handlers are designed to work with Drizzle ORM and PostgreSQL.

## Key Features

- **Type Safety**: Fully typed with TypeScript generics for better developer experience
- **Error Handling**: Built-in error handling and logging
- **Pagination**: Support for paginated queries
- **Filtering**: Support for custom filter conditions
- **Ordering**: Support for custom order conditions

## Import

```typescript
import { deleteRecord, insertRecord, selectRecordById, selectRecords, updateRecord } from "@/server"
```

## API Reference

### `selectRecords<T, TableColumns>(params)`

Retrieves multiple records from a table with pagination, filtering, and ordering.

```typescript
function selectRecords<T extends PgTable, TableColumns>({
  page,
  table,
  selectColumns,
  filterCondition,
  orderCondition,
  limit,
}: SelectRecordsParams<T, TableColumns>): Promise<GetAllDataResult<TableColumns>>
```

#### Parameters

- **params**: Configuration object with the following properties:
  - **page**: `number` - The page number to retrieve (1-based)
  - **table**: `PgTable` - The database table to query
  - **selectColumns**: `Record<keyof TableColumns, any>` - Optional columns to select
  - **filterCondition**: `SQL<unknown>` - Optional WHERE condition
  - **orderCondition**: `SQL<unknown>` - ORDER BY condition
  - **limit**: `number` - Optional number of records per page (default: 10)

#### Returns

- `Promise<GetAllDataResult<TableColumns>>` - Object containing:
  - **success**: `boolean` - Whether the operation was successful
  - **data**: `TableColumns[]` - Array of records
  - **totalRecords**: `number` - Total number of records matching the filter
  - **error**: `ErrorResponse` - Error information if success is false

#### Example

```typescript
async function getOrders(user: AuthUser, page: number): Promise<GetAllDataResult<Order>> {
  const filterCondition = eq(orders.userId, user.id)
  const orderCondition = desc(orders.createdAt)

  return selectRecords({
    page,
    table: orders,
    filterCondition,
    orderCondition,
  })
}
```

### `selectRecordById<T, R>(params)`

Retrieves a single record by its ID.

```typescript
function selectRecordById<T extends PgTable & TableWithId, R = any>({
  table,
  id,
  filterCondition,
}: SelectRecordByIdParams<T>): Promise<GetDataResult<R>>
```

#### Parameters

- **params**: Configuration object with the following properties:
  - **table**: `PgTable & TableWithId` - The database table to query
  - **id**: `string` - The ID of the record to retrieve
  - **filterCondition**: `SQL<unknown>` - Optional additional WHERE condition

#### Returns

- `Promise<GetDataResult<R>>` - Object containing:
  - **success**: `boolean` - Whether the operation was successful
  - **data**: `R | null` - The retrieved record or null if not found
  - **error**: `ErrorResponse` - Error information if success is false

#### Example

```typescript
async function getOrderById(user: AuthUser, orderId: string): Promise<GetDataResult<Order>> {
  const filterCondition = eq(orders.userId, user.id)

  return selectRecordById({
    table: orders,
    id: orderId,
    filterCondition,
  })
}
```

### `insertRecord<T>(params)`

Inserts a new record into the database.

```typescript
function insertRecord<T extends PgTable & TableWithId>({
  table,
  newRecord,
}: InsertRecordParams<T>): Promise<SaveDataResult<{ id: string }>>
```

#### Parameters

- **params**: Configuration object with the following properties:
  - **table**: `PgTable & TableWithId` - The database table to insert into
  - **newRecord**: `PgInsertValue<T>` - The record to insert

#### Returns

- `Promise<SaveDataResult<{ id: string }>>` - Object containing:
  - **success**: `boolean` - Whether the operation was successful
  - **data**: `{ id: string } | null` - The ID of the inserted record
  - **error**: `ErrorResponse` - Error information if success is false

#### Example

```typescript
async function insertOrder(user: AuthUser, order: Order) {
  order.userId = user.id

  return insertRecord({ table: orders, newRecord: order })
}
```

### `updateRecord<T>(params)`

Updates an existing record in the database.

```typescript
function updateRecord<T extends PgTable & TableWithId>({
  table,
  id,
  updatedRecord,
  filterCondition,
}: UpdateRecordParams<T>): Promise<SaveDataResult<{ id: string }>>
```

#### Parameters

- **params**: Configuration object with the following properties:
  - **table**: `PgTable & TableWithId` - The database table to update
  - **id**: `string` - Optional ID of the record to update
  - **updatedRecord**: `PgUpdateSetSource<T>` - The updated record values
  - **filterCondition**: `SQL<unknown>` - Optional WHERE condition (used if id is not provided)

#### Returns

- `Promise<SaveDataResult<{ id: string }>>` - Object containing:
  - **success**: `boolean` - Whether the operation was successful
  - **data**: `{ id: string } | null` - The ID of the updated record
  - **error**: `ErrorResponse` - Error information if success is false

#### Example

```typescript
async function updateOrder(user: AuthUser, orderId: string, orderData: Partial<Order>) {
  const filterCondition = sql`${orders.id} = ${orderId} AND ${orders.userId} = ${user.id}`

  return updateRecord({
    table: orders,
    updatedRecord: orderData,
    filterCondition,
  })
}
```

### `deleteRecord<T>(params)`

Deletes a record from the database.

```typescript
function deleteRecord<T extends PgTable & TableWithId>({
  table,
  id,
  filterCondition,
}: DeleteRecordParams<T>): Promise<SaveDataResult<{ id: string }>>
```

#### Parameters

- **params**: Configuration object with the following properties:
  - **table**: `PgTable & TableWithId` - The database table to delete from
  - **id**: `string` - Optional ID of the record to delete
  - **filterCondition**: `SQL<unknown>` - Optional WHERE condition (used if id is not provided)

#### Returns

- `Promise<SaveDataResult<{ id: string }>>` - Object containing:
  - **success**: `boolean` - Whether the operation was successful
  - **data**: `{ id: string } | null` - The ID of the deleted record
  - **error**: `ErrorResponse` - Error information if success is false

#### Example

```typescript
async function deleteOrder(user: AuthUser, orderId: string) {
  const filterCondition = sql`${orders.id} = ${orderId} AND ${orders.userId} = ${user.id}`

  return deleteRecord({
    table: orders,
    filterCondition,
  })
}
```

## Additional Utilities

### `getRecordCount<T>(table, condition)`

Counts the number of records in a table that match a condition.

```typescript
function getRecordCount<T extends PgTable>(table: T, condition?: SQL<unknown>): Promise<number>
```

#### Parameters

- **table**: `PgTable` - The database table to count records from
- **condition**: `SQL<unknown>` - Optional WHERE condition

#### Returns

- `Promise<number>` - The number of records that match the condition

#### Example

```typescript
async function countUserOrders(userId: string): Promise<number> {
  const condition = eq(orders.userId, userId)
  return getRecordCount(orders, condition)
}
```

## Error Handling

All data handlers include built-in error handling. If an error occurs during a database operation, the handler will:

1. Log the error with context information
2. Return a standardized error response
3. Preserve the original operation result structure

The error response includes:

- **success**: `false`
- **error**: Object containing error details
  - **message**: Human-readable error message
  - **code**: Error code for programmatic handling
  - **details**: Additional error details if available

## Working with Transactions

For operations that require transactions, you can use the `executeQuery` function to run custom SQL queries:

```typescript
async function transferFunds(fromAccountId: string, toAccountId: string, amount: number) {
  const query = `
    BEGIN;
    UPDATE accounts SET balance = balance - $1 WHERE id = $2;
    UPDATE accounts SET balance = balance + $1 WHERE id = $3;
    COMMIT;
  `

  return executeQuery({ query, params: [amount, fromAccountId, toAccountId] })
}
```

## Logging

All data handlers automatically log their operations using the logger from AsyncLocalStorage. This means you don't need to pass a logger or context to the data handlers - they will automatically use the logger from the current request context.

This is particularly useful when using the data handlers with the request handlers, as the request handlers set up the logger context for you.
