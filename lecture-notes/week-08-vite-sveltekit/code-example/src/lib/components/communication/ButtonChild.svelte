<script>
  let { text, onclick } = $props();
</script>

<button onclick={() => onclick?.('Button clicked')}>
  {text}
</button>