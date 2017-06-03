(function($) {

  var App = function() {
    this.$el = {
      getFilelist: $('#js-getFilelist'),
      loadFilelist: $('#js-loadFilelist'),
      loadingSpinner: $('.mdl-js-spinner'),
    };
    this._init();
  }

  App.prototype._init = function() {
    this.getFilelist();
    this.destroyFiles();
    this.checkboxControl();
  };

  App.prototype.getFilelist = function() {
    var self = this;
    var pushFlag = false;

    this.$el.getFilelist.on('submit', function(e) {
      e.preventDefault();

      self.$el.loadFilelist.hide().find('tbody').empty();
      self.$el.loadingSpinner.addClass('is-active');

      if (!pushFlag) {
        $.ajax({
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: $(this).serialize(),
        })
        .done(function(data) {
          if (data.error === 'not_authed') {
            alert('認証に失敗しました');
            return;
          }
          self.loadFilelist(data);
        })
        .always(function() {
          self.$el.loadingSpinner.removeClass('is-active');
          self.$el.loadFilelist.show();
          componentHandler.upgradeDom('MaterialCheckbox');
          pushFlag = false;
        })
        .fail(function() {
          console.log('error');
        });

        // set token
        $('#js-setToken').attr('value', $('#js-getToken').val());

        pushFlag = true;
      }
    });
  };

  App.prototype.loadFilelist = function(data) {

    for (key in data.files) {
      var id = data.files[key].id;
      var title = data.files[key].title;
      var size = data.files[key].size;
      var date = new Date(data.files[key].timestamp * 1000);
      var thumb = data.files[key].thumb_160 !== undefined ? data.files[key].thumb_160 : 'images/nothumb.png';

      this.$el.loadFilelist.find('tbody').append('<tr><td><label class="mdl-checkbox mdl-js-checkbox mdl-data-table__select table-body" for="cb-row-'+ key +'" id="cb-label-'+ key +'"><input type="checkbox" name="target" value="'+ id +'" id="cb-row-'+ key +'" class="mdl-checkbox__input"></label></td><td class="mdl-data-table__cell--non-numeric">'+ title +'</td><td class="mdl-data-table__cell--non-numeric"><img src="'+ thumb +'"></td><td class="mdl-data-table__cell--non-numeric">'+ size +' byte</td><td class="mdl-data-table__cell--non-numeric">'+ date +'</td></tr>');
    }
  }

  App.prototype.destroyFiles = function() {
    var self = this;
    var pushFlag = false;

    this.$el.loadFilelist.on('submit', function(e) {
      e.preventDefault();

      if (!confirm('指定されたファイルを削除しますか？')) {
        return;
      }

      if (!pushFlag) {
        $.ajax({
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: $(this).serialize(),
        })
        .done(function(data) {
          if (data.ok) {
            self.$el.getFilelist.submit();
          } else {
            console.log('error');
          }

          if (data.error === 'empty') {
            alert('ファイルを選択してください');
          }
        })
        .always(function() {
          pushFlag = false;
        })
        .fail(function() {
          console.log('error');
        });

        pushFlag = true;
      }
    });
  };

  App.prototype.checkboxControl = function() {
    $('#table-header').on('change', function() {
      var tableBody = document.querySelectorAll('.table-body');
      if (!$(this).parents().hasClass('is-checked')) {
        for (var i = 0; i < tableBody.length; i++) {
          tableBody[i].MaterialCheckbox.uncheck();
        }
      } else {
        for (var i = 0; i < tableBody.length; i++) {
          tableBody[i].MaterialCheckbox.check();
        }
      }
    });
    $(document).on('click', '#js-loadFilelist tbody', function(e) {
      e.preventDefault();
    });
    $(document).on('click', '#js-loadFilelist tbody tr', function() {
      var boxid = '#' + $(this).find('.table-body').attr('id');

      if($(this).find('.table-body').hasClass('is-checked')) {
        document.querySelector(boxid).MaterialCheckbox.uncheck();
      } else {
        document.querySelector(boxid).MaterialCheckbox.check();
      }
    });
  };

  $(function() {
    new App();
  });

})(jQuery);