<?php
/* Smarty version 3.1.29, created on 2017-12-14 06:05:34
  from "C:\Users\Utente\Documents\GitHub\SPLOD\splod\ow_plugins\newsfeed\views\components\feed.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a32852eb47121_10481786',
  'file_dependency' => 
  array (
    '8f22dc1eb5ff91be25ffebaef1c829bd08eebb30' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_plugins\\newsfeed\\views\\components\\feed.html',
      1 => 1470306118,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a32852eb47121_10481786 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\block.style.php';
if (!is_callable('smarty_function_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\splod\\ow_smarty\\plugin\\function.decorator.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


    ul.ow_newsfeed {
        padding: 5px 0px 0px 5px;
    }

    .ow_newsfeed_avatar {
        height: 45px;
        width: 45px;
        margin-right: -45px;
        float: left;
    }

    .ow_newsfeed_avatar img {
        height: 45px;
        width: 45px;
    }

    .ow_newsfeed_body {
        margin-left: 45px;
        padding-left: 10px;
    }

    .ow_newsfeed .ow_newsfeed_item {
       list-style-image: none;
        position: relative;
    }

    .ow_newsfeed_toolbar {
        float: none;
    }

    .ow_newsfeed .ow_comments_list {
        margin-bottom: 0px;
    }

    .ow_newsfeed_remove {
        position: absolute;
        top: 5px;
        right: 0px;
        display: none;
    }

    .ow_newsfeed_body:hover .ow_newsfeed_remove {
        display: block;
    }

    .ow_newsfeed_delimiter {
        border-bottom-width: 1px;
        height: 1px;
        margin-bottom: 7px;
    }

    .ow_newsfeed_doublesided_stdmargin {
        margin: 14px 0px;
    }

    .ow_newsfeed_likes {
        margin-bottom: 3px;
    }

    .ow_newsfeed_tooltip .tail {
        padding-left: 25px;
    }

    .ow_newsfeed_placeholder {
        height: 30px;
        background-position: center 5px;
    }

    .ow_newsfeed_view_more_c {
        text-align: center;
    }

    .ow_newsfeed_string {
    	max-width: 600px;
    }

    .ow_newsfeed_item_content {
        min-width: 50px;
    }

    .ow_newsfeed_item_picture + .ow_newsfeed_item_content {
        float: left;
        width: 69%;
        max-width: 440px;
    }

    .ow_newsfeed_features {
        max-width: 450px;
        overflow: hidden;
        min-height: 62px;
    }

    .ow_newsfeed_feedback_counter {
        padding: 2px 5px;
    }

    .ow_newsfeed_activity_content {
        border-top-style: dashed;
        border-top-width: 1px;
        padding-top: 3px;
    }

    .ow_newsfeed_comments .ow_add_comments_form
    {
        margin-bottom: 0px;
    }
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

<div id="<?php echo $_smarty_tpl->tpl_vars['autoId']->value;?>
">
    <?php if (!empty($_smarty_tpl->tpl_vars['statusMessage']->value)) {?>
        <div class="ow_smallmargin ow_center">
            <?php echo $_smarty_tpl->tpl_vars['statusMessage']->value;?>

        </div>
    <?php } elseif (!empty($_smarty_tpl->tpl_vars['status']->value)) {?>
        <div class="ow_smallmargin">
            <?php echo $_smarty_tpl->tpl_vars['status']->value;?>

        </div>
    <?php }?>
    
    <ul class="ow_newsfeed ow_smallmargin">
        <?php echo $_smarty_tpl->tpl_vars['list']->value;?>

    </ul>
    
    <?php if ($_smarty_tpl->tpl_vars['viewMore']->value) {?>
            <div class="ow_newsfeed_view_more_c">
                <?php echo smarty_function_decorator(array('name'=>"button",'class'=>"ow_newsfeed_view_more ow_ic_down_arrow",'langLabel'=>"newsfeed+feed_view_more_btn"),$_smarty_tpl);?>

            </div>
    <?php }?>
</div><?php }
}
