<script lang="ts">
	import { getStore } from './Store'
	import Select, { Option } from '@smui/select'

	const store = getStore()
</script>

<div>
	<Select>
		<!-- {#each $store.datasets as dataset}
			<Option value={dataset}>{dataset}</Option> -->
		<!-- {/each}		  -->
		<Option>a</Option>
	</Select>
</div>
