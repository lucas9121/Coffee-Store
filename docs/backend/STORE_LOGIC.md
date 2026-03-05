# Store Open Logic

The store is considered open if:

1. Manual override is set to "open"
2. Manual override is set to "closed"
3. Otherwise:
   - Today’s day is enabled
   - Current time is between open and close

Manual override expires when:
- currentDate > expiresAt