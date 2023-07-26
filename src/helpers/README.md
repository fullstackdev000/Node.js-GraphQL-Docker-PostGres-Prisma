# VeewMe - helper functions.

This directory contains several helpers, such as password hashing/comparing and email sending helper.

## Email helper (`email.ts`)

(Please fill in SENDGRID_KEY, SENDGRID_FROM and SENDGRID_TEMPLATE_ID enviroment variables before using).

### SendGrid templating

SendGrid email templates can be accessed and created upon logging in [here](https://mc.sendgrid.com/dynamic-templates). There are two types of Template: Legacy (works with older SendGrid version, more precisely, V2), and Dynamic (V3 only). Since we are only using new SendGrid API, Dynamic should be the obvious choice.

#### `sendWelcomeAffiliateEmail`

Same with `sendBasicEmail`, but includes `dynamic_template_data` object to specify variable values that will replace `{{{ var_name }}}` raw HTML template data (which can be seen on SendGrid's template editor). It accepts two arguments:

- `name`: The name of the target. Can be first name, or first name + last name.
- `targetEmail`: Recipient's email address.

![image](https://user-images.githubusercontent.com/7723097/75338961-2d972000-58c2-11ea-8aa6-65082004272b.png)
