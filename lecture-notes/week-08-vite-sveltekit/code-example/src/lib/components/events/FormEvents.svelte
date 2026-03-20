<script>
  let form = $state({
    username: '',
    firstName: '',
    lastName: '',
  })
  let message = $state('');

  const handleInput = (e) => (message = `You typed ${e.target.value}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    message = `Form successfully submitted. Info: Username: ${form.username}, First Name: ${form.firstName}, Last Name: ${form.lastName}`;
  };

  const handleFocus = () => (message = 'Username input field focused');
  const handleBlur = () => (message = 'Username input field lost focus');
</script>

<form onsubmit={handleSubmit}>
  <label for="username">Username:</label>
  <input
    id="username"
    type="text"
    bind:value={form.username}
    oninput={handleInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    placeholder="Enter username"
  />

  <label for="firstName">First Name:</label>
  <input id="firstName" type="text" bind:value={form.firstName} placeholder="Enter first name" />

  <label for="lastName">Last Name:</label>
  <input id="lastName" type="text" bind:value={form.lastName} placeholder="Enter last name" />

  <button type="submit">Submit</button>
</form>

<p>{message}</p>