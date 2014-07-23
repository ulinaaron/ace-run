<?php
//* Start the engine
include_once( get_template_directory() . '/lib/init.php' );

//* Child theme (do not remove)
define( 'CHILD_THEME_NAME', 'Ace Run Child Theme' );
define( 'CHILD_THEME_URL', 'http://www.aaronmazade.com/' );
define( 'CHILD_THEME_VERSION', '2.0.1' );

//* Enqueue Scripts
add_action( 'wp_enqueue_scripts', 'ar_enqueue_script' );
function ar_enqueue_script() {
    wp_enqueue_script( 'main', get_bloginfo( 'stylesheet_directory' ) . '/assets/js/main.min.js', array( 'jquery' ), '1.0.0' );
}

//* Enqueue Lato Google font
add_action( 'wp_enqueue_scripts', 'ar_load_google_fonts' );
function ar_load_google_fonts() {
	wp_enqueue_style( 'google-font-lato', '//fonts.googleapis.com/css?family=Lato:300,700', array(), CHILD_THEME_VERSION );
}

//* Create blue, green, orange and red color style options
add_theme_support( 'genesis-style-selector', array(
    'skin-info'	=> __( 'Info', 'themename' ),
    'skin-success'	=> __( 'Success', 'themename' ),
    'skin-warning'	=> __( 'Warning', 'themename' ),
    'skin-alert'	=> __( 'Alert', 'themename' )
) );

//* Add HTML5 markup structure
add_theme_support( 'html5' );

//* Add viewport meta tag for mobile browsers
add_theme_support( 'genesis-responsive-viewport' );

//* Add support for custom background
add_theme_support( 'custom-background' );

//* Add support for 3-column footer widgets
add_theme_support( 'genesis-footer-widgets', 3 );

//* Remove Genesis in-post SEO Settings
remove_action( 'admin_menu', 'genesis_add_inpost_seo_box' );

//* Remove Genesis SEO Settings menu link
remove_theme_support( 'genesis-seo-settings-menu' );

//* Change the footer text (copyright)
add_filter('genesis_footer_creds_text', 'sp_footer_creds_filter');
function sp_footer_creds_filter( $creds ) {

	$creds = '[footer_copyright] &middot; Site Name';
	return $creds;

}

/* Functions for conditional loading
--------------------------------------------- */

//* Initialize WOW.js
//* -------------------------------------
//* Initialize WOW.js
add_action('genesis_after_footer','ar_init_wowjs', 30 );
function ar_init_wowjs() {
	?>
	<script>

        /**
         * WOW animate.css if transitions are supported
         */
        if(supportsTransitions() && window.innerWidth > 767){
            new WOW().init({ mobile: false });
        }

    </script>
	<?php
}



