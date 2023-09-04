# 09: Installation and Developer Tools

## Vite

## Installation

```bash
npm create vite@latest frontend-playground -- --template react
```

```bash
cd frontend-playground
npm install
npm run dev
```

![](<../../resources (ignore)/img/09/01-installation.png>)

### File Structure

### App.jsx

```jsx
const App = () => {
  return <h1>Hello, World!</h1>
}

export default App;
```

![](<../../resources (ignore)/img/09/02-installation.png>)

```jsx
const App = () => {
  return (
    <>
      <h1>Hello, World!</h1>
      <img
        src="https://archives.bulbagarden.net/media/upload/4/4a/0025Pikachu.png"
        alt="Pikachu"
        width="150"
        height="150"
      />
    </>
  );
};

export default App;
```

![](<../../resources (ignore)/img/09/03-installation.png>)