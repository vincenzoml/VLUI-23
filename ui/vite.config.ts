import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	server: {		
		fs: {
			allow: ['/workspaces/VLUI-23/ui/niivue','/workspaces/VLUI-23/ui/specifications','/workspaces/VLUI-23/ui/results']
		}
	}
})
