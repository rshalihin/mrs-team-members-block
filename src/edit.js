import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl } from "@wordpress/components";
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { columns } = attributes;
	const onColumnsChanged = (newColumns) =>{
		setAttributes({ columns: newColumns });
	}
	return (
		<div { ...useBlockProps({
			className: `has-${columns}-columns`
		}) }>
			<InspectorControls>
				<PanelBody title={__('Team Members Settings', 'mrs-team-members')} initialOpen>
					<RangeControl
					    label={__('Number of columns', 'mrs-team-members')}
						value={columns}
						onChange={onColumnsChanged}
						min={1}
						max={6}
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks allowedBlocks={['mrs/team-member']}
				template={[
					['mrs/team-member', { name: 'John Doe', bio: 'CEO of Janina' }],
					['mrs/team-member', { name: 'John Doe', bio: 'Founder of Pore Bolbo' }]
				]}
			/>
		</div>
	);
}
