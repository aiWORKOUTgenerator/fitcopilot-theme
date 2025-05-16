# ESLint and TypeScript Troubleshooting Guide

This guide provides solutions for common ESLint warnings and TypeScript errors you might encounter during development.

## Common ESLint Warnings

### 1. `@typescript-eslint/no-explicit-any`

**Warning:**
```
ESLint: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)
```

**Solutions:**

1. **Replace with specific type:** 
   ```typescript
   // Before
   function process(data: any): void {}

   // After
   interface ProcessData {
     id: string;
     value: number;
   }
   function process(data: ProcessData): void {}
   ```

2. **Use unknown with type guards:**
   ```typescript
   function process(data: unknown): void {
     if (typeof data === 'object' && data !== null && 'id' in data) {
       // Now TypeScript knows data has 'id'
       console.log((data as { id: string }).id);
     }
   }
   ```

3. **Use generics:**
   ```typescript
   function process<T>(data: T): void {}
   ```

### 2. `react-hooks/exhaustive-deps`

**Warning:**
```
ESLint: React Hook useEffect has a missing dependency: 'userId'. Either include it or remove the dependency array. (react-hooks/exhaustive-deps)
```

**Solutions:**

1. **Add the missing dependency:**
   ```typescript
   // Before
   useEffect(() => {
     fetchData(userId);
   }, []);

   // After
   useEffect(() => {
     fetchData(userId);
   }, [userId]);
   ```

2. **Move the value outside the hook if it should run only once:**
   ```typescript
   // Define outside the component or use useRef
   const initialUserId = userId;
   
   useEffect(() => {
     fetchData(initialUserId);
   }, []);
   ```

3. **Use useCallback for functions:**
   ```typescript
   const fetchUserData = useCallback(() => {
     fetchData(userId);
   }, [userId]);

   useEffect(() => {
     fetchUserData();
   }, [fetchUserData]);
   ```

### 3. `@typescript-eslint/no-unused-vars`

**Warning:**
```
ESLint: 'event' is declared but its value is never read. (@typescript-eslint/no-unused-vars)
```

**Solutions:**

1. **Remove unused variable:**
   ```typescript
   // Before
   function handleSubmit(event) {
     submitForm();
   }

   // After
   function handleSubmit() {
     submitForm();
   }
   ```

2. **Prefix with underscore to indicate intentional non-use:**
   ```typescript
   function handleSubmit(_event) {
     submitForm();
   }
   ```

3. **Destructure only what you need:**
   ```typescript
   function handleChange({ target }) {
     console.log(target.value);
   }
   ```

### 4. `no-console`

**Warning:**
```
ESLint: Unexpected console statement. (no-console)
```

**Solutions:**

1. **Use logger utility:**
   ```typescript
   // Before
   console.log('User data:', userData);

   // After
   import { logger } from '../utils/logger';
   logger.info('User data:', { userData });
   ```

2. **Remove debug logs before committing:**
   ```typescript
   // Remove entirely if it was just for debugging
   ```

## Common TypeScript Errors

### 1. Type 'X' is not assignable to type 'Y'

**Error:**
```
Type '{ label: string; onClick: () => void; }' is not assignable to type 'ButtonProps'.
  Property 'variant' is missing in type '{ label: string; onClick: () => void; }' but required in type 'ButtonProps'.
```

**Solutions:**

1. **Add the missing property:**
   ```typescript
   // Before
   <Button label="Click me" onClick={handleClick} />

   // After
   <Button variant="primary" label="Click me" onClick={handleClick} />
   ```

2. **Check if the type has changed:**
   ```typescript
   // Maybe the component now requires a discriminated union pattern
   interface ButtonProps {
     variant: 'primary' | 'secondary';
     // other props
   }
   ```

### 2. Property 'X' does not exist on type 'Y'

**Error:**
```
Property 'value' does not exist on type 'EventTarget'.
```

**Solutions:**

1. **Use correct event typing:**
   ```typescript
   // Before
   const handleChange = (e: React.ChangeEvent<any>) => {
     console.log(e.target.value);
   };

   // After
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     console.log(e.target.value);
   };
   ```

2. **Add type assertion when safe:**
   ```typescript
   const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
     const input = e.target as HTMLInputElement;
     console.log(input.value);
   };
   ```

### 3. Type 'null' is not assignable to type 'X'

**Error:**
```
Type 'null' is not assignable to type 'string'.
```

**Solutions:**

1. **Add null check:**
   ```typescript
   // Before
   const username: string = user.name;

   // After
   const username: string = user?.name || '';
   ```

2. **Use union type to allow null:**
   ```typescript
   const username: string | null = user?.name;
   
   // Then check before use
   if (username) {
     console.log(username.toUpperCase());
   }
   ```

### 4. Cannot invoke an object which is possibly 'undefined'

**Error:**
```
Cannot invoke an object which is possibly 'undefined'.
```

**Solutions:**

1. **Add non-null assertion when you're certain:**
   ```typescript
   // Before
   const callback = props.onClick;
   callback();

   // After (when you're sure it exists)
   const callback = props.onClick!;
   callback();
   ```

2. **Add conditional check (safer):**
   ```typescript
   const callback = props.onClick;
   if (callback) {
     callback();
   }
   ```

3. **Use optional chaining:**
   ```typescript
   props.onClick?.();
   ```

## Working with Discriminated Unions

### 1. Error when accessing properties

**Error:**
```
Property 'href' does not exist on type 'ButtonProps'.
  Property 'href' does not exist on type 'PrimaryButtonProps'.
```

**Solutions:**

1. **Use type guard to narrow the type:**
   ```typescript
   // Before
   const Button: React.FC<ButtonProps> = (props) => {
     return props.variant === 'link' ? 
       <a href={props.href}>...</a> : // Error: props.href might not exist
       <button>...</button>;
   };

   // After
   function isLinkButton(props: ButtonProps): props is LinkButtonProps {
     return props.variant === 'link';
   }

   const Button: React.FC<ButtonProps> = (props) => {
     if (isLinkButton(props)) {
       return <a href={props.href}>...</a>; // No error, TypeScript knows props has href
     }
     return <button>...</button>;
   };
   ```

2. **Check property existence with conditional:**
   ```typescript
   const Button: React.FC<ButtonProps> = (props) => {
     if (props.variant === 'link' && 'href' in props) {
       return <a href={props.href}>...</a>; // TypeScript understands props has href
     }
     return <button>...</button>;
   };
   ```

## Common ESLint Configuration Issues

### 1. ESLint not respecting .eslintignore

**Solution:**
- Check file path in .eslintignore
- Use absolute paths if needed
- Make sure the file is in the right format

### 2. ESLint warnings in IDE but not in terminal (or vice versa)

**Solution:**
- Check for different ESLint configs
- Restart IDE or language server
- Make sure IDE extensions are up-to-date

### 3. Auto-fix not working

**Solution:**
- Check if the rule is auto-fixable
- Make sure your editor is configured to run ESLint on save
- Verify `editor.codeActionsOnSave` settings

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [TypeScript Documentation](https://www.typescriptlang.org/docs/)
2. Consult the [ESLint Documentation](https://eslint.org/docs/latest/)
3. Reference the project's [Type Safety Guide](./type-safety-guide.md)
4. Ask for help in the team's development channel 