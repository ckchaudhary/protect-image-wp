<?php
/* 
Plugin Name: Protect Images WP
Description: Protect your images. Period!
Version: 0.1
*/

add_action( 'init', 'protectimagewp_init_plugin' );
function protectimagewp_init_plugin(){
    $instance = ProtectImagesWP::get_instance();
}

class ProtectImagesWP{

    private static $instance;

    private function __construct(){
        $this->add_action_filters();
    }

    public static function get_instance(){
        if(!isset(self::$instance)){
            self::$instance=new self();
        }
        return self::$instance;
    }

    function add_action_filters(){
        add_action( 'wp_enqueue_scripts',    array( $this, 'addjs' ) );
        add_filter( 'the_content',           array( $this, 'add_image_layer' ) );
    }

    function addjs(){
        wp_enqueue_script( 'protectimagewp', plugins_url( 'script.js', __FILE__) );
        $data = array(
            'overlay_image'     => plugins_url('blank.gif', __FILE__),
            'viewport_size'     => array(
                                        'width'     => 0,
                                        'height'    => 0
                                    ),
            'cover_timeout'     => null,
            'timeout_interval'  => 1000

        );
        wp_localize_script( 'protectimagewp', 'PIWP_', $data );
    }

    function add_image_layer( $content ){
        $elem_p = '/<img[^>]*>/i';
        $prop_p = '/ ([\w]+)[ ]*=[ ]*([\"\'])(.*?)\2/i';

        preg_match_all( $elem_p, $content, $images, PREG_SET_ORDER );

        foreach( $images as $img ){
            preg_match_all( $prop_p, $img[0], $attributes, PREG_SET_ORDER );

            $overlay = '<img';
            $classValue = 'pp_img';

            foreach( $attributes as $att ){
                $full = $att[0];
                $name = $att[1];
                $value = $att[3];

                if( $name != "class" ){
                    $overlay .= $full;
                }
                else{
                    $classValue = $value .= ' protectimage_wp';
                }
            }

            $overlay .= " class='$classValue' />";

            $content = str_replace($img[0], $overlay, $content);
        }
        return $content;
    }
}//end class