import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { __ } from "@wordpress/i18n";
import { Icon } from "@wordpress/components";

export default function sortable(props) {
    const { index, selectedLink, icon, socialIconColor, setSelectedLink } = props;
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id: props.id})
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={index}
            className={selectedLink === index ? 'is-selected' : null}
        >
            <button onClick={() => setSelectedLink(index)} aria-label={__('Edit Social Link', 'mrs-team-members')}>
                <Icon icon={icon} data-icon-color={socialIconColor} style={{color: socialIconColor}} />
            </button>                                       
        </li>
    )
}