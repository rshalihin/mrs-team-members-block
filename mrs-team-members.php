<?php
/**
 * Plugin Name:       MRS Team Members
 * Description:       A simple Gutenberg block to organize and show team members details..
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Md. Readush Shalihin
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mrs-team-members
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_team_members_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_team_members_block_init' );

/**
 * Register A custom block category.
 *
 * @param [bool]  $block_categories .
 * @param [array] $editor_context .
 * @return array block_categories
 */
function mrs_simple_block_team_members_block_category_register( $block_categories, $editor_context ) {
	if ( ! empty( $editor_context->post ) ) {
		array_push(
			$block_categories,
			array(
				'slug'  => 'mrs-block',
				'title' => __( 'MRS BLOCK', 'mrs-team-members' ),
				'icon'  => 'layout',
			)
		);
	}
	return $block_categories;
}

add_filter( 'block_categories_all', 'mrs_simple_block_team_members_block_category_register', 10, 2 );

/**
 * DashIcons enqueue
 *
 * @return void
 */
function mrs_simple_block_team_members_block_assets() {
	if ( ! is_admin() ) {
		wp_enqueue_style( 'dashicons-css', '/wp-includes/css/dashicons.css', '', '6.5.2', 'all' );
	}
}
add_action( 'init', 'mrs_simple_block_team_members_block_assets' );
