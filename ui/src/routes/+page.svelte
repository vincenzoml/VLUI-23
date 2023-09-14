<script lang="ts">
	import axios from 'axios';

	async function onclick() {
		const response = await axios.post('/run', {
			specification: 'print "Hello, world!" "ciao"',
            items: []
		});
        console.log(response.data)
	}
</script>

<div style="width:100vw; height:100vh;overflow: hidden;background-color: orange;padding:0">
	<button on:click={onclick}>CLICK HERE</button>
</div>
