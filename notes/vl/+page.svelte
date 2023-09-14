<script lang="ts">
	import Niivue from '../../components/Niivue.svelte'
    let overlays : string[] = ["/projects/BraTS20_Training_001/BraTS20_Training_001_seg.nii.gz"]
</script>

<div style="width:500px;height:500px">
	<Niivue src="/projects/BraTS20_Training_001/BraTS20_Training_001_flair.nii.gz" {overlays} />
</div>
<button on:click={()=>overlays=["/projects/BraTS20_Training_001/BraTS20_Training_001_t1.nii.gz"]}>ClickMe</button>


