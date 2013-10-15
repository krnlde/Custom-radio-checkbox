/*!
 * jQuery Custom Radio Checkbox Plugin
 * Copyright (c) 2012 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/Custom-radio-checkbox/master/LICENSE.txt)
 */
(function ($) {
  $.fn.customRadioCheckbox = function (options) {
    // don't act on absent elements, can't chain anyway
    if (!this[0]) {
      return;
    }

    // checked suffix
    var checkedSuffix = '-checked',

      // css class used to hide inputs
      hiddenInputClass = 'rc-hidden',

      // function that inserts the fake input
      insertFakeInput = function (inputs) {
        var type = inputs.type,
          l = inputs.length,
          fakeInputElem,
          input;

        while (l--) {
          // current input
          input = inputs[l];

          // fake input
          fakeInputElem = $('<i>').addClass(type + (input.checked ? ' ' + type + checkedSuffix : '')).on('click.crc', function () {
            $(this).prev().click();
          });
          if (input.disabled) {
            fakeInputElem.addClass('disabled');
          }


          // insert the fake input after the input
          input.parentNode.insertBefore(fakeInputElem[0], input.nextSibling);
        }
      };

    return this.each(function () {

      var $context = $(this),
        // find & hide radios
        rds = $context.find('input[type=radio]:not(.' + hiddenInputClass + ')').addClass(hiddenInputClass),
        // find & hide checkboxes
        chs = $context.find('input[type=checkbox]:not(.' + hiddenInputClass + ')').addClass(hiddenInputClass),
        // storage for each radio group to use later
        rdsCache = {},
        // total radios
        rdsLength = rds.length,
        rd;

      // only apply if there are radios
      if (rds.length) {
        rds.type = 'radio';

        // insert each fake radio
        insertFakeInput(rds);

        // initialize rdsCache for prechecked inputs
        while (rdsLength--) {
          rd = rds[rdsLength];
          if (rd.checked) {
            (rdsCache[rd.name] = {}).checked = $(rd.nextSibling);
          }
        }

        // bind radio change event
        rds.bind('change.crc', function (e, force) {
          // uncheck previous and remove checked class
          if (!force || !this.checked) {
            // filter by name and remove class from the last radio checked
            // save this collection in cache obj for faster use
            if (!rdsCache[this.name]) {
              rdsCache[this.name] = {};
            }

            // uncheck last checked from this group
            if (rdsCache[this.name].checked) {
              rdsCache[this.name].checked.removeClass(rds.type + checkedSuffix);
            }

            // add checked class to this input and save it as checked for this group
            rdsCache[this.name].checked = $(this.nextSibling).addClass(rds.type + checkedSuffix);
          }

          // if force set to true and is not already checked, check the input
          if (force && !this.checked) {
            this.checked = true;
          }
        });
      }

      // only apply if there are checkboxes
      if (chs.length) {
        chs.type = 'checkbox';

        // insert each fake checkbox
        insertFakeInput(chs);

        // bind checkbox change event
        chs.bind('change.crc', function (e) {
          // toggle checked class
          $(this.nextSibling).toggleClass(chs.type + checkedSuffix, this.checked);
        });
      }
      $(this.nextSibling).toggleClass('disabled', $context.prop('disabled'));
    });
  };

  // auto-init the plugin
  $(function () {
    $('body').customRadioCheckbox();
  });
}(jQuery));