<script>
  import ButtonChild from './ButtonChild.svelte';

  let message = $state('');

  const handleClick = (data) => {
    message = data;
  };
</script>

<ButtonChild text="Click Me" onclick={handleClick} />
<p>{message}</p>