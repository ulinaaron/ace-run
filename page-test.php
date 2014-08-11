<?php
/**
 * This file adds a barebones test page template
 *
 * @author Aaron Mazade
 * @package Ace Run
 * @subpackage Customizations
 */

/*
Template Name: Test Page
*/

//* Add custom body class to the head
add_filter( 'body_class', 'ace_add_body_class' );
function ace_add_body_class( $classes ) {

   $classes[] = 'ace-test';
   return $classes;

}

add_action('genesis_before_loop','do_test_content');
function do_test_content() {
?>
<?php
}

//* Force full width content layout
add_filter( 'genesis_site_layout', '__genesis_return_full_width_content' );


//* Run the Genesis loop
genesis();
