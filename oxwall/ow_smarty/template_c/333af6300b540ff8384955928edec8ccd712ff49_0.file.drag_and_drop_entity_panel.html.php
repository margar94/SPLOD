<?php
/* Smarty version 3.1.29, created on 2017-11-15 07:43:50
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\drag_and_drop_entity_panel.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0c60b6e75404_68705363',
  'file_dependency' => 
  array (
    '333af6300b540ff8384955928edec8ccd712ff49' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\drag_and_drop_entity_panel.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0c60b6e75404_68705363 ($_smarty_tpl) {
if (!is_callable('smarty_block_script')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.script.php';
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
if (!is_callable('smarty_function_add_content')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.add_content.php';
if (!is_callable('smarty_block_block_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.block_decorator.php';
if (!is_callable('smarty_function_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.decorator.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('script', array()); $_block_repeat=true; echo smarty_block_script(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    DND_InterfaceFix.fix('.place_section');
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_script(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


    #place_components .component {
        float: left;
    }

    .view_component div{
       overflow: hidden;
    }

<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<?php echo smarty_function_add_content(array('key'=>'base.widget_panel.content.top','placeName'=>$_smarty_tpl->tpl_vars['placeName']->value,'entityId'=>$_smarty_tpl->tpl_vars['entityId']->value),$_smarty_tpl);?>


<?php if ($_smarty_tpl->tpl_vars['allowCustomize']->value) {?>
	<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>'box','addClass'=>'ow_highbox ow_stdmargin customize_box','type'=>"empty")); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>'box','addClass'=>'ow_highbox ow_stdmargin customize_box','type'=>"empty"), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

		    <div class="ow_center">
		        <?php echo smarty_function_decorator(array('name'=>'button','langLabel'=>'base+widgets_customize_btn','class'=>'ow_ic_gear_wheel','id'=>'goto_customize_btn'),$_smarty_tpl);?>

		    </div>
	<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>'box','addClass'=>'ow_highbox ow_stdmargin customize_box','type'=>"empty"), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

<?php }?>

<div class="ow_stdmargin" id="place_sections">

    <div class="clearfix">

        <div class="place_section top_section">

            <?php if (isset($_smarty_tpl->tpl_vars['componentList']->value['section']['top'])) {?>
                <?php
$_from = $_smarty_tpl->tpl_vars['componentList']->value['section']['top'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_component_0_saved_item = isset($_smarty_tpl->tpl_vars['component']) ? $_smarty_tpl->tpl_vars['component'] : false;
$_smarty_tpl->tpl_vars['component'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['component']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['component']->value) {
$_smarty_tpl->tpl_vars['component']->_loop = true;
$__foreach_component_0_saved_local_item = $_smarty_tpl->tpl_vars['component'];
?>
                    <?php echo $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['dd_component'][0][0]->tplComponent(array('uniqName'=>$_smarty_tpl->tpl_vars['component']->value['uniqName'],'render'=>true),$_smarty_tpl);?>

                <?php
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_0_saved_local_item;
}
if ($__foreach_component_0_saved_item) {
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_0_saved_item;
}
?>
            <?php }?>

        </div>

        <div class="clearfix" style="overflow: hidden;">

            <div class="ow_left place_section left_section <?php if (isset($_smarty_tpl->tpl_vars['activeScheme']->value['leftCssClass'])) {
echo $_smarty_tpl->tpl_vars['activeScheme']->value['leftCssClass'];
}?>">

                <?php if (isset($_smarty_tpl->tpl_vars['componentList']->value['section']['left'])) {?>
                    <?php
$_from = $_smarty_tpl->tpl_vars['componentList']->value['section']['left'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_component_1_saved_item = isset($_smarty_tpl->tpl_vars['component']) ? $_smarty_tpl->tpl_vars['component'] : false;
$_smarty_tpl->tpl_vars['component'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['component']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['component']->value) {
$_smarty_tpl->tpl_vars['component']->_loop = true;
$__foreach_component_1_saved_local_item = $_smarty_tpl->tpl_vars['component'];
?>
                        <?php echo $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['dd_component'][0][0]->tplComponent(array('uniqName'=>$_smarty_tpl->tpl_vars['component']->value['uniqName'],'render'=>true),$_smarty_tpl);?>

                    <?php
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_1_saved_local_item;
}
if ($__foreach_component_1_saved_item) {
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_1_saved_item;
}
?>
                <?php }?>

            </div>

            <div class="ow_right place_section right_section <?php if (isset($_smarty_tpl->tpl_vars['activeScheme']->value['rightCssClass'])) {
echo $_smarty_tpl->tpl_vars['activeScheme']->value['rightCssClass'];
}?>" >

                <?php if (isset($_smarty_tpl->tpl_vars['componentList']->value['section']['right'])) {?>
                    <?php
$_from = $_smarty_tpl->tpl_vars['componentList']->value['section']['right'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_component_2_saved_item = isset($_smarty_tpl->tpl_vars['component']) ? $_smarty_tpl->tpl_vars['component'] : false;
$_smarty_tpl->tpl_vars['component'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['component']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['component']->value) {
$_smarty_tpl->tpl_vars['component']->_loop = true;
$__foreach_component_2_saved_local_item = $_smarty_tpl->tpl_vars['component'];
?>
                        <?php echo $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['dd_component'][0][0]->tplComponent(array('uniqName'=>$_smarty_tpl->tpl_vars['component']->value['uniqName'],'render'=>true),$_smarty_tpl);?>

                    <?php
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_2_saved_local_item;
}
if ($__foreach_component_2_saved_item) {
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_2_saved_item;
}
?>
                <?php }?>

            </div>

         </div>

        <div class="place_section bottom_section">

            <?php if (isset($_smarty_tpl->tpl_vars['componentList']->value['section']['bottom'])) {?>
                <?php
$_from = $_smarty_tpl->tpl_vars['componentList']->value['section']['bottom'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_component_3_saved_item = isset($_smarty_tpl->tpl_vars['component']) ? $_smarty_tpl->tpl_vars['component'] : false;
$_smarty_tpl->tpl_vars['component'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['component']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['component']->value) {
$_smarty_tpl->tpl_vars['component']->_loop = true;
$__foreach_component_3_saved_local_item = $_smarty_tpl->tpl_vars['component'];
?>
                    <?php echo $_smarty_tpl->smarty->registered_plugins[Smarty::PLUGIN_FUNCTION]['dd_component'][0][0]->tplComponent(array('uniqName'=>$_smarty_tpl->tpl_vars['component']->value['uniqName'],'render'=>true),$_smarty_tpl);?>

                <?php
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_3_saved_local_item;
}
if ($__foreach_component_3_saved_item) {
$_smarty_tpl->tpl_vars['component'] = $__foreach_component_3_saved_item;
}
?>
            <?php }?>

        </div>

    </div>

</div>

<?php echo smarty_function_add_content(array('key'=>'base.widget_panel.content.bottom','placeName'=>$_smarty_tpl->tpl_vars['placeName']->value,'entityId'=>$_smarty_tpl->tpl_vars['entityId']->value),$_smarty_tpl);
}
}
