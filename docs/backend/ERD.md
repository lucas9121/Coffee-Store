# Entity Relationship Diagram – ChurchKiosk

MongoDB + Mongoose Data Model

------------------------------------------------------

Order
------------------------------------------------------
_id (ObjectId)
customerName (String)
user (ObjectId → User | null)
status (Enum)
source (Enum: MOBILE | IN PERSON)
isPaid (Boolean)
orderItems [Array]
  ├─ item (ObjectId → OrderItem)
  ├─ quantity (Number)
  └─ priceAtPurchase (Number)
totalPrice (Number)
createdAt
updatedAt

Relationships:
Order (Many) → OrderItem (One)
An Order references multiple OrderItems.

Order (Many) → User (One, optional)
An authenticated customer's order references the User who placed it.
Guest orders store user as null.

------------------------------------------------------

OrderItem (Menu Item)
------------------------------------------------------
_id (ObjectId)
name (String)
price (Number)
image (String)
category (Enum: coffee | juice | food | dessert)
inStock (Boolean)
isVisible (Boolean)
createdAt
updatedAt

Independent entity referenced by Order.

------------------------------------------------------

StoreSettings
------------------------------------------------------
_id (ObjectId)

weeklySchedule
  ├─ sunday
  ├─ monday
  ├─ tuesday
  ├─ wednesday
  ├─ thursday
  ├─ friday
  └─ saturday
      ├─ open (String)
      ├─ close (String)
      └─ enabled (Boolean)

manualOverride
  ├─ status ("open" | "closed" | null)
  └─ expiresAt (Date | null)

createdAt
updatedAt

Design Note:
Only one StoreSettings document is expected in the system.

------------------------------------------------------

User
------------------------------------------------------
_id (ObjectId)
name (String)
email (String)
password (String)
account (Enum: user | worker | admin)
expoPushToken (String | null)
securityQuestions [Array]
favorites [Array → OrderItem]
recent [Array → OrderItem]
refreshTokenHash (String, optional)
refreshTokenExpiresAt (Date, optional)
createdAt
updatedAt

Relationships:
User (One) ← Order (Many, optional)
An authenticated customer's orders reference the User who placed them.
Guest orders store user as null.

User (Many) → OrderItem (Many)
Users may reference OrderItems through favorites and recent purchases.

![ChurchKiosk ERD]
