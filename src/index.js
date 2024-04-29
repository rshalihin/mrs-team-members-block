import { registerBlockType, createBlock } from '@wordpress/blocks';
import './style.scss';
import './team-member';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
	transforms: {
		from: [{
			type: 'block',
			blocks: ['core/gallery'],
			transform: ({ columns, images}) => {
				const innerBlock = images.map( ({url, alt, id}) => {
					return createBlock('mrs/team-member', {
						url,
						alt,
						id
					})
				})
				return createBlock(metadata.name, {
					columns: columns || 3
				}, innerBlock )
			}
		},
		{
			type: 'block',
			blocks: ['core/image'],
			isMultiBlock: true,
			transform: (attributes) => {
				const innerBlock = attributes.map( (attribute) => {
					return createBlock( 'mrs/team-member', {
						url: attribute.url,
                        alt: attribute.alt,
                        id: attribute.id
					});
				});
				return createBlock(metadata.name, {
					columns: attributes.length > 3 ? 3 : attributes.length
				}, innerBlock)
			}
		}
	]
	}
} );
