import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';


registerBlockType( 'mrs/team-member', {
    apiVersion: 'v3',
    title: 'MRS Team Member',
    icon: 'admin-users',
    description: 'A single block of team members',
    parent: ['mrs/team-members'],
    supports: {
        html: false,
        reusable: false,
        color: {
            backgroundColor: true,
            text: false,
        }
    },
    attributes: {
        name: {
            type: 'string',
            source: 'html',
            selector: 'h4'
        },
        bio: {
            type: 'string',
            source: 'html',
            selector: 'p'
        },
        id: {
            type: 'number'
        },
        alt: {
            type: 'string',
            source: 'attribute',
            selector: 'img',
            attribute: 'alt'
        },
        url: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
        socialLinks: {
            type: 'array',
            default: [],
            source: 'query',
            selector: '.mrs-team-members-social-links ul li',
            query: {
                icon: {
                    source: 'attribute',
                    attribute: 'data-icon',
                },
                link: {
                    source: 'attribute',
                    selector: 'a',
                    attribute: 'href',
                }
            }
        },
        socialIconColor: {
            type: 'string',
            source: 'attribute',
            selector: '.mrs-team-members-social-links ul li a span.dashicon',
            attribute: 'data-icon-color',
            default: '#4e4e4e',
        },
        nameColor: {
            type:'string',
            default: '#000000'
        },
        bioColor: {
            type:'string',
            default: '#333333'
        },
        shadow:{
            type: 'boolean',
            default: false
        },
        shadowOpacity: {
            type: 'number',
        }
    },
	edit: Edit,
	save,
} );