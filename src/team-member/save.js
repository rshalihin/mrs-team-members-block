import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Icon } from '@wordpress/components';

export default function save({ attributes}) {
    const { name, bio, id, url, alt, socialLinks, socialIconColor } = attributes;
	return (
		<div { ...useBlockProps.save() }>
            {url && <img className={ id ? `wp-image-${id}` : null } src={url} alt={alt} />}
			{name && <RichText.Content tagName='h4' value={ name }/>}
            {bio && <RichText.Content tagName='p' value={ bio } /> }
            {socialLinks.length > 0 && 
                <div className='mrs-team-members-social-links'>
                    <ul>                        
                    { socialLinks && socialLinks.map( (item, index) =>{
                        return (
                            <li key={index} data-icon={item.icon}>
                                <a href={ item.link} >
                                    <Icon icon={item.icon} data-icon-color={socialIconColor} style={{color: socialIconColor}}  />
                                </a>                            
                            </li>
                        )
                    } )}
                    </ul>
                </div>
            }
		</div>
	);
}