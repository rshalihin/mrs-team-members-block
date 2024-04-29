import { __ } from '@wordpress/i18n';
import { useSelect } from "@wordpress/data";
import { usePrevious } from "@wordpress/compose";
import { useEffect, useState, useRef } from "@wordpress/element";
import { useBlockProps, RichText, MediaPlaceholder, BlockControls, MediaReplaceFlow, InspectorControls } from '@wordpress/block-editor';
import { isBlobURL, revokeBlobURL } from "@wordpress/blob";
import { Icon, Spinner, ToolbarButton, PanelBody, TextareaControl, withNotices, SelectControl, Tooltip, TextControl, Button, ColorPalette, RangeControl } from "@wordpress/components";
import { DndContext, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./sortable-item";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

function Edit({ attributes, setAttributes, noticeOperations, noticeUI, isSelected}) {
    const { name, bio, id, url, alt, socialLinks, socialIconColor, nameColor, bioColor, shadow, shadowOpacity } = attributes;
    const [ blobURL, setBlobURL ] = useState();
    const [ selectedLink, setSelectedLink ] = useState();
    const titleRef = useRef();
    const prevUrl = usePrevious(url);
    const prevSelected = usePrevious(isSelected);
    const sortableSensors = useSensors( useSensor( PointerSensor, {
        activationConstraint: { distance: 5 }
    } ) );

    const socialOptions = [      
        { label: 'WordPress', value: 'wordpress' },      
        { label: 'Amazon', value: 'amazon'},
        { label: 'Email', value: 'email-alt'},
        { label: 'Facebook', value: 'facebook'},
        { label: 'Facebook-alt', value: 'facebook-alt'},
        { label: 'Google', value: 'google'},
        { label: 'Instagram', value: 'instagram'},
        { label: 'Linkedin', value: 'linkedin'},
        { label: 'Pinterest', value: 'pinterest'},
        { label: 'Reddit', value: 'reddit'},
        { label: 'Spotify', value: 'spotify'},
        { label: 'Twitter', value: 'twitter'},
        { label: 'Twitter-alt', value: 'twitter-alt'},
        { label: 'Whatsapp', value: 'whatsapp'},
        { label: 'Xing', value: 'xing'},
        { label: 'Youtube', value: 'youtube'},
    ];

    const getSettingsColor = useSelect((select) => {
        return select('core/block-editor').getSettings();
    }, []);


    const imageObject = useSelect( (select) => {
        const { getMedia } = select('core');
        return id ? getMedia(id) : null;
    }, [id]);
    const imageSizes = useSelect( (select) => {
        const { getSettings } = select('core/block-editor');
        return getSettings().imageSizes;
    }, []);

    const imageSizesOptions = () => {
        if ( !imageObject ) return [];
        const options = [];
        const sizes = imageObject.media_details.sizes;
        for ( const key in sizes ) {
            const size = sizes[key];

            const imageSize = imageSizes.find( s => s.slug === key );
            if ( imageSize ) {
                options.push({
                    label: imageSize.name,
                    value: size.url
                });
            }
        }
        return options;
    }

    const onNameChange = (newName) => {
        setAttributes({ name: newName });
    };
    const onBioChange = (newBio) => {
        setAttributes({ bio: newBio });
    };
    const onSelectImage = ( newImage ) =>{
        if ( !newImage || !newImage.url ) {
            setAttributes({ id: undefined, url: undefined, alt: '' });
            return;
        }
        setAttributes({ id: newImage.id, url: newImage.url, alt: newImage.alt });
    }
    const onSelectURLImage = ( newImageURL ) =>{
        setAttributes({ id: undefined, url: newImageURL, alt: '' });
    }
    const removeImage = () => {
        setAttributes({ id: undefined, url: undefined, alt: '' });
    }
    const onChangeImageAlt = (newAlt) => {
        setAttributes({ alt: newAlt });
    }
    const onUploadError = (errorMessage) => {
        noticeOperations.removeAllNotices();
        noticeOperations.createErrorNotice(errorMessage);
    }
    const onAddSocialLinks = () => {
       setAttributes({
        socialLinks: [...socialLinks, {icon: 'wordpress', link: ''}]
       });
        setSelectedLink(socialLinks.length);
    }
    const onUpdateSocialIconLink = (type, value) => {
        const socialLinksCopy = [...socialLinks];
        socialLinksCopy[selectedLink][type] = value;        
        setAttributes({ socialLinks: socialLinksCopy });
    }
    const onRemoveSocialItem = () => {
        setAttributes({
            socialLinks: [
                ...socialLinks.slice(0, selectedLink),
                ...socialLinks.slice(selectedLink + 1 )
            ]
        });
        setSelectedLink();
    }
    const onSocialIconColorChange = (newColor) => {
        setAttributes({socialIconColor: newColor});
    }
    const onSortableDragEnd = (event) => {
        const { active, over } = event;
        if ( active && over && active.id !== over.id ) {
            const oldIndex = socialLinks.findIndex( (i) => active.id === `${i.icon}-${i.link}`);
            const newIndex = socialLinks.findIndex( (i) => over.id === `${i.icon}-${i.link}`);
            setAttributes({
                socialLinks: arrayMove(socialLinks, oldIndex, newIndex)
            });
            setSelectedLink(newIndex);
        };
    };
    const onNameColorChange = (newColor) => {
        setAttributes({nameColor: newColor});
    }
    const onBioColorChange = (newColor) => {
        setAttributes({bioColor: newColor});
    }
    const onToggleShadowChange =  () => {
        setAttributes({ shadow: !shadow });
    }

    useEffect( () => {
        if ( !id && isBlobURL( url ) ) {
            setAttributes({ url: undefined, alt: '' });
        }
    },[])

    useEffect( () => {
        if ( isBlobURL( url ) ) {
            setBlobURL( url );
        } else {
            revokeBlobURL( blobURL );
            setBlobURL();
        }
    }, [url]);

    useEffect( () => {
        if ( url && !prevUrl && isSelected ) {
            titleRef.current.focus();
        }
    }, [url, prevUrl]);

    useEffect( () => {
        if ( prevSelected && !isSelected ){
            setSelectedLink();
        }
    }, [prevSelected, isSelected])
    
	return (
        <>
            <InspectorControls>
                <PanelBody title={__('Member Details', 'mrs-team-members')}>
                    { url && !isBlobURL( url ) &&
                    <TextareaControl
                        label={__('Image Alt Text', 'mrs-team-members')}
                        value={alt}
                        onChange={onChangeImageAlt}
                        help={__('Enter the alt text for the image', 'mrs-team-members')}
                    />}
                    <SelectControl
                        label={__('Image Size', 'mrs-team-members')}
                        value={url}
                        options={imageSizesOptions()}
                        onChange={(newUrl) => {setAttributes({url: newUrl})}}
                    />
                </PanelBody>
                
                    {socialLinks.length > 0 && selectedLink !== undefined &&
                    <PanelBody title={__('Social Icon Color Details', 'mrs-team-members')} initialOpen={false}>
                    <ColorPalette
                    aria-label={__('Social Icon Colors Details', 'mrs-team-members')}
                    colors={getSettingsColor.colors}
                    value={socialIconColor}
                    onChange={onSocialIconColorChange}
                    />                    
                </PanelBody>}
                <PanelBody title={__('Name Color Style', 'mrs-team-members')} initialOpen={false}>
                    {<ColorPalette
                        colors={getSettingsColor.colors}
                        value={nameColor}
                        onChange={onNameColorChange}
                    />}
                </PanelBody>
                <PanelBody title={__('Bio Color Style', 'mrs-team-members')} initialOpen={false}>
                    {<ColorPalette
                        colors={getSettingsColor.colors}
                        value={bioColor}
                        onChange={onBioColorChange}
                    />}
                    
                </PanelBody>
                { isSelected && shadow &&
                <PanelBody title={__('Shadow Settings', 'mrs-team-members')} initialOpen={false}>
                    <RangeControl
                        help="Shadow Opacity"
                        value={shadowOpacity}
                        label="Shadow Opacity"
                        max={50}
                        min={10}
                        step={10}
                        onChange={(newShadowOpacity) => {setAttributes({shadowOpacity: newShadowOpacity})}}
                    />
                </PanelBody>
                }
            </InspectorControls>
            { url && (
            <BlockControls>
                { isSelected && 
                <ToolbarButton
                    onClick={onToggleShadowChange}
                    isActive={shadow}
                    icon={'admin-page'}
                    label={__('Block Shadow', 'mrs-team-members')}
                />}
                <MediaReplaceFlow
                    name={ __('Replace', 'mrs-team-members')}
                    accept='image/*'
                    allowedTypes={['image']}
                    onSelect={onSelectImage}
                    onSelectURL={onSelectURLImage}
                    mediaId={id}
                    mediaURL={url}
                />
                <ToolbarButton onClick={removeImage}>
                    {__('Remove Image', 'mrs-team-members')}
                </ToolbarButton>
            </BlockControls>
            )}
            <div { ...useBlockProps({
                className: shadow ? `has-shadow-opacity-${shadowOpacity}` : null
            }) }>
                <MediaPlaceholder
                    icon={'admin-users'}
                    accept='image/*'
                    allowedTypes={['image']}
                    onSelect={onSelectImage}
                    onSelectURL={onSelectURLImage}
                    onError={onUploadError}
                    disableMediaButtons={url}
                    notices={ noticeUI}
                />
                { url && (
                    <div className={`mrs-team-members-img${ isBlobURL(url) ? ' is-loading' : '' }`}>
                        <img src={url} alt={alt} />
                        { isBlobURL(url) && <Spinner /> }
                    </div>
                )}
                <RichText
                    ref={titleRef}
                    tagName='h4'
                    placeholder={ __( 'Enter Team Member Name' ) }
                    value={ name }
                    onChange={onNameChange}
                    style={{color: nameColor}}
                />
                <RichText
                    tagName='p'
                    placeholder={ __( 'Enter Team Member Details' ) }
                    value={ bio }
                    onChange={onBioChange}
                    style={{color: bioColor}}
                />
                <div className='mrs-team-members-social-links'>
                    <ul>
                    <DndContext sensors={sortableSensors} onDragEnd={onSortableDragEnd} modifiers={[restrictToHorizontalAxis]}>
                        <SortableContext items={socialLinks.map(item=>`${item.icon}-${item.link}`)} strategy={horizontalListSortingStrategy}
                        >
                            {socialLinks && socialLinks.map((item, index) => {
                                return (
                                    <SortableItem
                                        key={`${item.icon}-${item.link}`}
                                        id={`${item.icon}-${item.link}`}
                                        index={index}
                                        selectedLink={selectedLink}
                                        icon={item.icon}
                                        socialIconColor={socialIconColor}
                                        setSelectedLink={setSelectedLink}
                                    />
                                )
                            })}
                        </SortableContext>
                    </DndContext>
                    { isSelected && 
                        <Tooltip text={__('Add Social Links', 'mrs-team-members')}>
                            <li className='mrs-team-members-social-links-add-link-li'>
                                <button onClick={onAddSocialLinks} aria-label={__('Add Social Link', 'mrs-team-members')}>
                                    <Icon icon={'plus'} />
                                </button> 
                             </li>                           
                        </Tooltip>
                    }
                    </ul>
                </div>
                { socialLinks[selectedLink] !== undefined &&
                    <div className='mrs-team-members-social-links-add-link-li-form'>
                        <SelectControl
                            label={__('Social Icon', 'mrs-team-members')}
                            value={socialLinks[selectedLink].icon}
                            options={socialOptions}
                            onChange={(icon) => onUpdateSocialIconLink('icon', icon)}
                        />
                        <TextControl
                            label={__('Social Link', 'mrs-team-members')}
                            value={socialLinks[selectedLink].link}
                            onChange={(link) => onUpdateSocialIconLink('link', link)}
                        />
                        <Button isDestructive onClick={onRemoveSocialItem}>Remove Social Item</Button>
                    </div>
                }
            </div>
        </>
	);
}
export default withNotices(Edit);
