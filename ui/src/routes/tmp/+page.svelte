<script lang="ts">
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion'
</script>

<div class="accordion-container">
	<Accordion>
		<Panel>
			<Header>Panel 1</Header>
			<Content>
				The content for panel 1.

				<ul>
					<li>Some</li>
					<li>List</li>
					<li>Items</li>
				</ul>
			</Content>
		</Panel>
		<Panel>
			<Header>Panel 2</Header>
			<Content>The content for panel 2.</Content>
		</Panel>
		<Panel>
			<Header>Panel 3</Header>
			<Content>
				The content for panel 3.

				<ul>
					<li>Some</li>
					<li>More</li>
					<li>List</li>
					<li>Items</li>
					<li>To</li>
					<li>Show</li>
					<li>Big</li>
					<li>Height</li>
				</ul>
			</Content>
		</Panel>
		<Panel>
			<Header>Panel 4</Header>
			<Content>
				If you like this component, you can thank <a
					href="https://github.com/NickantX"
					target="_blank">nick</a
				> who pushed me to make it. He was right, accordions are awesome! :D
			</Content>
		</Panel>
	</Accordion>
</div>

<style>
	* :global(.accordion-container) {
		padding: 24px;
		background-color: var(--mdc-theme-background, #f8f8f8);
	}

	* :global(.smui-accordion) {
		margin: 0 12px 24px;
	}

	* :global(.smui-accordion:last-child) {
		margin-bottom: 0;
	}
</style>
