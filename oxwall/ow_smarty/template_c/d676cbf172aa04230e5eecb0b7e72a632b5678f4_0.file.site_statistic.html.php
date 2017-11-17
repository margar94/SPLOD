<?php
/* Smarty version 3.1.29, created on 2017-11-17 01:23:09
  from "C:\Users\Utente\Documents\GitHub\SPLOD\oxwall\ow_system_plugins\base\views\components\site_statistic.html" */

if ($_smarty_tpl->smarty->ext->_validateCompiled->decodeProperties($_smarty_tpl, array (
  'has_nocache_code' => false,
  'version' => '3.1.29',
  'unifunc' => 'content_5a0eaa7d72c043_69169635',
  'file_dependency' => 
  array (
    'd676cbf172aa04230e5eecb0b7e72a632b5678f4' => 
    array (
      0 => 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_system_plugins\\base\\views\\components\\site_statistic.html',
      1 => 1470306056,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5a0eaa7d72c043_69169635 ($_smarty_tpl) {
if (!is_callable('smarty_block_style')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.style.php';
if (!is_callable('smarty_block_script')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\block.script.php';
if (!is_callable('smarty_function_text')) require_once 'C:\\Users\\Utente\\Documents\\GitHub\\SPLOD\\oxwall\\ow_smarty\\plugin\\function.text.php';
$_smarty_tpl->smarty->_cache['tag_stack'][] = array('style', array()); $_block_repeat=true; echo smarty_block_style(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    .statistic_amount {
        margin-top:10px;
    }

    .statistic_amount h3 {
        margin-bottom: 10px;
    }
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_style(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<?php $_smarty_tpl->smarty->_cache['tag_stack'][] = array('script', array()); $_block_repeat=true; echo smarty_block_script(array(), null, $_smarty_tpl, $_block_repeat);while ($_block_repeat) { ob_start();?>

    var ctx = $("#<?php echo $_smarty_tpl->tpl_vars['chartId']->value;?>
").get(0).getContext("2d");
    ctx.canvas.height = 100;

    var data = {
        labels: <?php echo $_smarty_tpl->tpl_vars['categories']->value;?>
,
        datasets: <?php echo $_smarty_tpl->tpl_vars['data']->value;?>

    };

    
        var lineChart = new Chart(ctx).Line(data, {
            animation: false,
            responsive : true,
            tooltipTemplate: "<?php echo '<%'; ?>
= datasetLabel <?php echo '%>'; ?>
 - <?php echo '<%'; ?>
= value <?php echo '%>'; ?>
",
            multiTooltipTemplate: "<?php echo '<%'; ?>
= datasetLabel <?php echo '%>'; ?>
 - <?php echo '<%'; ?>
= value <?php echo '%>'; ?>
"
        });
    

    if ( typeof OW.WidgetPanel != "undefined" )
    {
        // Rebuild the chart
        OW.WidgetPanel.bind("move", function(e)
        {
            var canvasId = $(e.widget).find("canvas").attr("id");

            if (canvasId == "<?php echo $_smarty_tpl->tpl_vars['chartId']->value;?>
")
            {
                lineChart.destroy();
                lineChart = new Chart(ctx).Line(data, {
                    animation: false,
                    responsive : true,
                    tooltipTemplate: "<?php echo '<%';?>= datasetLabel <?php echo '%>';?> - <?php echo '<%';?>= value <?php echo '%>';?>",
                    multiTooltipTemplate: "<?php echo '<%';?>= datasetLabel <?php echo '%>';?> - <?php echo '<%';?>= value <?php echo '%>';?>"
                });
            }
        });
    }
<?php $_block_content = ob_get_clean(); $_block_repeat=false; echo smarty_block_script(array(), $_block_content, $_smarty_tpl, $_block_repeat);  } array_pop($_smarty_tpl->smarty->_cache['tag_stack']);?>


<div class="statistic_chart_wrapper">
    <canvas id="<?php echo $_smarty_tpl->tpl_vars['chartId']->value;?>
"></canvas>
</div>
<div class="statistic_amount">
    <h3><?php echo smarty_function_text(array('key'=>'admin+statistics_amount_for_period'),$_smarty_tpl);?>
 :</h3>
    <ul>
        <?php
$_from = $_smarty_tpl->tpl_vars['total']->value;
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$__foreach_info_0_saved_item = isset($_smarty_tpl->tpl_vars['info']) ? $_smarty_tpl->tpl_vars['info'] : false;
$_smarty_tpl->tpl_vars['info'] = new Smarty_Variable();
$_smarty_tpl->tpl_vars['info']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['info']->value) {
$_smarty_tpl->tpl_vars['info']->_loop = true;
$__foreach_info_0_saved_local_item = $_smarty_tpl->tpl_vars['info'];
?>
        <li>
            <?php echo $_smarty_tpl->tpl_vars['info']->value['label'];?>
: <b><?php echo $_smarty_tpl->tpl_vars['info']->value['count'];?>
</b>
        </li>
        <?php
$_smarty_tpl->tpl_vars['info'] = $__foreach_info_0_saved_local_item;
}
if ($__foreach_info_0_saved_item) {
$_smarty_tpl->tpl_vars['info'] = $__foreach_info_0_saved_item;
}
?>
    </ul>
</div>
<?php }
}
