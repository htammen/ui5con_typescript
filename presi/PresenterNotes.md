# Demo tssandbox
## 1st Example
- create `greeting.ts`
- add code 
```typescript
function greet(msg: string): string {
	return `Hello ${msg}`
}

console.log(greet("UI5Con"))
console.log(greet(true))
```
- notice error in `greet(true)`
- tsc greeting.ts
- compile time error !!
- run program `node greeting.js`
- show @ts-ignore in source
- show tsc --watch (cmd line and VS Code)
- show ts settings
```json
    "files.exclude": {
        "**/*.js": {
            "when": "$(basename).ts"
        },
        "**/*.js.map": true
    },
```
- show `Problems` view in VS Code 
- Mention `.vscode/tasks.json`
```
"problemMatcher": [
    "$tsc-watch"
],
```
and
```
"runOptions": {
    "runOn": "folderOpen"
}
```

## UI5 example
- Show application: `npm start`, `http://localhost:8080/index.html`
- open `tsconfig.json`
    - `"module": "none"`
    - `"target": "..."`
    - `"sourceMap": true`
    - `"types": ["@openui5/ts-types"]`
    - `"include": ["./webapp/**/*.ts", "./typings/**/*"],`
- open `package.json`
    - `"devDependencies": { "@openui5/ts-types": "^1.65.1",`
    - https://github.com/SAP/ui5-typescript/tree/master/packages/ts-types

    
