<?php
/* Smarty version 3.1.29, created on 2017-11-14 01:58:49
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\admin\views\components\content_statistic_widget.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0abe5975cf28_95970509',
  'file_dependency' => 
  array (
    'd7c9bce14d0a837ebfec5b6564a1c75ac7600dd2' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\admin\\views\\components\\content_statistic_widget.html',
      1 => 1510588878,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0abe5975cf28_95970509 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
if (!is_callable('smarty_block_script')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.script.php';
if (!is_callable('smarty_block_form')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.form.php';
if (!is_callable('smarty_function_input')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.input.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    #admin-content-statistics-header #content-statistics-form {
        float:left;
    }

    #admin-content-statistics-header #content-statistics-form select {
        width:200px;
    }

    #admin-content-statistics-header #content-statistics-menu {
        float:right;
    }

    #admin-content-statistics-container .ow_ajaxloader_preloader {
        min-height:300px;
    }
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('script', array()); $_block_repeat=true; echo smarty_block_script(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    var defaultPeriod = "<?php echo $_smarty_tpl->tpl_vars['defaultPeriod']->value;?>
";
    var defaultContentGroup = "<?php echo $_smarty_tpl->tpl_vars['defaultContentGroup']->value;?>
";

    $("#content-statistics-menu a").on("click", function(){
        defaultPeriod = $(this).attr("id");
        defaultPeriod = defaultPeriod.replace("content_menu_statistics_", "");

        reloadChart();
    });

    $("#content-statistics-form select").on("change", function(){
        defaultContentGroup = $(this).val();
        reloadChart();
    });

    /**
     * Reload chart
     *
     * @return void
     */
    function reloadChart()
    {
        if (!defaultContentGroup || !defaultPeriod)
        {
            return;
        }

        OW.loadComponent("ADMIN_CMP_ContentStatistic", [{
            "defaultContentGroup" : defaultContentGroup,
            "defaultPeriod" : defaultPeriod
        }], "#admin-content-statistics-container");
    }
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_script(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<div id="admin-content-statistics-header">
    <?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('form', array('name'=>"content_statistics_form")); $_block_repeat=true; echo smarty_block_form(array('name'=>"content_statistics_form"), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    <div id="content-statistics-form">
        <?php echo smarty_function_input(array('name'=>"group"),$_smarty_tpl);?>

    </div>
    <?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_form(array('name'=>"content_statistics_form"), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>

    <div id="content-statistics-menu">
        <?php echo $_smarty_tpl->tpl_vars['menu']->value;?>

    </div>
    <div class="clearfix"></div>
</div>

<div id="admin-content-statistics-container">
    <?php echo $_smarty_tpl->tpl_vars['statistics']->value;?>

</div>
<?php }
}
