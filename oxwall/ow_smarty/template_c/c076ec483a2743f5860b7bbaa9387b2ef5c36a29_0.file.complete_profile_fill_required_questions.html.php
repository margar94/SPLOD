<?php
/* Smarty version 3.1.29, created on 2017-11-14 01:58:38
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\controllers\complete_profile_fill_required_questions.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abe4e5dba70_76440410',
  'file_dependency' => 
  array (
    'c076ec483a2743f5860b7bbaa9387b2ef5c36a29' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\controllers\\complete_profile_fill_required_questions.html',
      1 => 1510588878,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abe4e5dba70_76440410 ($_smarty_tpl) {
if (!is_callable('smarty_block_block_decorator')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.block_decorator.php';
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
if (!is_callable('smarty_function_cycle')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_libraries\\vendor\\smarty\\smarty\\libs\\plugins\\function.cycle.php';
if (!is_callable('smarty_function_label')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.label.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.input.php';
if (!is_callable('smarty_function_error')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.error.php';
if (!is_callable('smarty_function_question_description_lang')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.question_description_lang.php';
if (!is_callable('smarty_function_submit')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.submit.php';
?>

<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>"box",'type'=>"empty",'addClass'=>"ow_superwide ow_automargin")); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>"box",'type'=>"empty",'addClass'=>"ow_superwide ow_automargin"), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>


    <?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('block_decorator', array('name'=>"box_cap",'type'=>"empty",'addClass'=>"ow_center",'style'=>"padding:15px;",'langLabel'=>"base+required_profile_questions")); $_block_repeat=true; echo smarty_block_block_decorator(array('name'=>"box_cap",'type'=>"empty",'addClass'=>"ow_center",'style'=>"padding:15px;",'langLabel'=>"base+required_profile_questions"), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    <?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>"box_cap",'type'=>"empty",'addClass'=>"ow_center",'style'=>"padding:15px;",'langLabel'=>"base+required_profile_questions"), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


    <?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>'requiredQuestionsForm')); $_block_repeat=true; echo smarty_block_form(array('name'=>'requiredQuestionsForm'), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

        <table class="ow_table_1 ow_form ow_stdmargin">
            <?php
$_from = $_smarty_tpl->tpl_vars['questionArray']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_question_0_saved = isset($_smarty_tpl->tpl_vars['__smarty_foreach_question']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_question'] : false;
$__foreach_question_0_saved_item = isset($_smarty_tpl->tpl_vars['questions']) ? $_smarty_tpl->tpl_vars['questions'] : false;
$__foreach_question_0_saved_key = isset($_smarty_tpl->tpl_vars['section']) ? $_smarty_tpl->tpl_vars['section'] : false;
$__foreach_question_0_total = $_smarty_tpl->smarty->ext->_foreach->count($_from);
$_smarty_tpl->tpl_vars['questions'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['__smarty_foreach_question'] = new Smarty_Variable(array());
$_smarty_tpl->tpl_vars['section'] = new Smarty_Variable();
$__foreach_question_0_first = true;
$__foreach_question_0_iteration=0;
$_smarty_tpl->tpl_vars['questions']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['section']->value => $_smarty_tpl->tpl_vars['questions']->value) {
$_smarty_tpl->tpl_vars['questions']->_loop = true;
$__foreach_question_0_iteration++;
$_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['first'] = $__foreach_question_0_first;
$_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['last'] = $__foreach_question_0_iteration == $__foreach_question_0_total;
$__foreach_question_0_first = false;
$__foreach_question_0_saved_local_item = $_smarty_tpl->tpl_vars['questions'];
?>

                <?php if (!empty($_smarty_tpl->tpl_vars['section']->value)) {?>
                    <tr class="ow_tr_first"><th colspan="3"><?php echo smarty_function_text(array('key'=>"base+questions_section_".((string)$_smarty_tpl->tpl_vars['section']->value)."_label"),$_smarty_tpl);?>
</th></tr>
                <?php }?>
                
                <?php
$_from = $_smarty_tpl->tpl_vars['questions']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_question_1_saved = isset($_smarty_tpl->tpl_vars['__smarty_foreach_question']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_question'] : false;
$__foreach_question_1_saved_item = isset($_smarty_tpl->tpl_vars['question']) ? $_smarty_tpl->tpl_vars['question'] : false;
$__foreach_question_1_total = $_smarty_tpl->smarty->ext->_foreach->count($_from);
$_smarty_tpl->tpl_vars['question'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['__smarty_foreach_question'] = new Smarty_Variable(array());
$__foreach_question_1_first = true;
$__foreach_question_1_iteration=0;
$_smarty_tpl->tpl_vars['question']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['question']->value) {
$_smarty_tpl->tpl_vars['question']->_loop = true;
$__foreach_question_1_iteration++;
$_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['first'] = $__foreach_question_1_first;
$_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['last'] = $__foreach_question_1_iteration == $__foreach_question_1_total;
$__foreach_question_1_first = false;
$__foreach_question_1_saved_local_item = $_smarty_tpl->tpl_vars['question'];
?>
                    <?php echo smarty_function_cycle(array('assign'=>'alt','name'=>$_smarty_tpl->tpl_vars['section']->value,'values'=>'ow_alt1,ow_alt2'),$_smarty_tpl);?>

                    <tr class=" <?php if ((isset($_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['last']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['last'] : null)) {?>ow_tr_last<?php }?>">
                        <td class="<?php echo $_smarty_tpl->tpl_vars['alt']->value;?>
 ow_label">
                            <?php echo smarty_function_label(array('name'=>$_smarty_tpl->tpl_vars['question']->value['name']),$_smarty_tpl);?>

                        </td>
                        <td class="<?php echo $_smarty_tpl->tpl_vars['alt']->value;?>
 ow_value">
                            <?php echo smarty_function_input(array('name'=>$_smarty_tpl->tpl_vars['question']->value['name']),$_smarty_tpl);?>

                            <div style="height:1px;"></div>
                            <?php echo smarty_function_error(array('name'=>$_smarty_tpl->tpl_vars['question']->value['name']),$_smarty_tpl);?>

                        </td>
                        <td class="<?php echo $_smarty_tpl->tpl_vars['alt']->value;?>
 ow_desc ow_small">
                            <?php echo smarty_function_question_description_lang(array('name'=>$_smarty_tpl->tpl_vars['question']->value['name']),$_smarty_tpl);?>

                        </td>
                    </tr>
                <?php
$_smarty_tpl->tpl_vars['question'] = $__foreach_question_1_saved_local_item;
}
if ($__foreach_question_1_saved) {
$_smarty_tpl->tpl_vars['__smarty_foreach_question'] = $__foreach_question_1_saved;
}
if ($__foreach_question_1_saved_item) {
$_smarty_tpl->tpl_vars['question'] = $__foreach_question_1_saved_item;
}
?>

                <?php if (!empty($_smarty_tpl->tpl_vars['section']->value)) {?>
                    <?php if (!(isset($_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['first']) ? $_smarty_tpl->tpl_vars['__smarty_foreach_question']->value['first'] : null)) {?>
                        <tr class="ow_tr_delimiter"><td></td></tr>
                    <?php }?>
                <?php }?>

            <?php
$_smarty_tpl->tpl_vars['questions'] = $__foreach_question_0_saved_local_item;
}
if ($__foreach_question_0_saved) {
$_smarty_tpl->tpl_vars['__smarty_foreach_question'] = $__foreach_question_0_saved;
}
if ($__foreach_question_0_saved_item) {
$_smarty_tpl->tpl_vars['questions'] = $__foreach_question_0_saved_item;
}
if ($__foreach_question_0_saved_key) {
$_smarty_tpl->tpl_vars['section'] = $__foreach_question_0_saved_key;
}
?>
        </table>
        <div class="clearfix ow_stdmargin">
           <div class="ow_right">
               <?php echo smarty_function_submit(array('name'=>'submit'),$_smarty_tpl);?>

           </div>
        </div>
    <?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>'requiredQuestionsForm'), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_block_decorator(array('name'=>"box",'type'=>"empty",'addClass'=>"ow_superwide ow_automargin"), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);
}
}
