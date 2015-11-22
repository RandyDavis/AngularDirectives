(function() {

  var tableHelperWithNgModel = function () {

      var template = '<div class="tableHelper"></div>',

      //ngModel object will be passed in due to require: 'ngModel' in DDO below
      link = function(scope, element, attrs, ngModel) {
          var headerCols = [],
              tableStart = '<table>',
              tableEnd = '</table>',
              table = '',
              visibleProps = [],
              datasource,
              sortCol = null,
              sortDir = 1;

          //Watch for ngModel to change. Required since the $modelValue
          //will be NaN initially
          // Can do it with $observe but we'll use a better way
          //attrs.$observe('ngModel', function (value) {
          //   scope.$watch(value, function (newValue) {
          //       render();
          //   });
          //});

          // Also works, but not the one we think is best
          //scope.$watch(attrs.ngModel, render);

          // Good one but we'll look at one more
          //scope.$watch(function () {
          //   return ngModel.$modelValue;
          //}, function (newValue) {
          //    render();
          //});

          // Settled on this one, note how simple but the others mentioned maybe be better in other situations
          ngModel.$render = function () {
              render();
          };





          wireEvents();

          function render() {
              if (ngModel && ngModel.$modelValue.length) {
                  datasource = ngModel.$modelValue;
                  table += tableStart;
                  table += renderHeader();
                  table += renderRows() + tableEnd;
                  renderTable();
              }

          }

          function wireEvents() {
              element.on('click', function(event) {
                 if (event.srcElement.nodeName === 'TH') {
                     var val = event.srcElement.innerHTML;
                     var col = (scope.columnmap) ? getRawColumnName(val) : val;
                     if (col) sort(col);
                 }
              });
          }

          function sort(col) {
              //See if they clicked on the same header
              //If they did then reverse the sort
              if (sortCol === col) sortDir = sortDir * -1;
              sortCol = col;
              datasource.sort(function(a,b) {
                 if (a[col] > b[col]) return 1 * sortDir;
                 if (a[col] < b[col]) return -1 * sortDir;
                 return 0;
              });
              render();
          }

          function renderHeader() {
               var tr = '<tr>';
               for (var prop in datasource[0]) {
                   var val = getColumnName(prop);
                   if (val) {
                       //Track visible properties to make it fast to check them later
                       visibleProps.push(prop);
                       tr += '<th>' + val + '</th>';
                   }
               }
               tr += '</tr>';
               tr = '<thead>' + tr + '</thead>';
               return tr;
          }

          function renderRows() {
               var rows = '';
               for (var i = 0, len = datasource.length; i < len; i++) {
                    rows += '<tr>';
                    var row = datasource[i];
                    for (var prop in row) {
                        if (visibleProps.indexOf(prop) > -1) {
                            rows += '<td>' + row[prop] + '</td>';
                        }
                    }
                    rows += '</tr>';
               }
               rows = '<tbody>' + rows + '</tbody>';
               return rows;
          }

          function renderTable() {
              table += '<br /><div class="rowCount">' + datasource.length + ' rows</div>';
              element.html(table);
              table = '';
          }

          function getRawColumnName(friendlyCol) {
              var rawCol;
              scope.columnmap.forEach(function(colMap) {
                  for (var prop in colMap) {
                      if (colMap[prop] === friendlyCol) {
                         rawCol = prop;
                         break;
                      }
                  }
                  return null;
              });
              return rawCol;
          }

          function getRawColumnName(friendlyCol) {
              var rawCol;
              scope.columnmap.forEach(function(colMap) {
                  for (var prop in colMap) {
                      if (colMap[prop] === friendlyCol) {
                         rawCol = prop;
                         break;
                      }
                  }
                  return null;
              });
              return rawCol;
          }

          function filterColumnMap(prop) {
              var val = scope.columnmap.filter(function(map) {
                  if (map[prop]) {
                      return true;
                  }
                  return false;
              });
              return val;
          }

          function getColumnName(prop) {
              if (!scope.columnmap) return prop;
              var val = filterColumnMap(prop);
              if (val && val.length && !val[0].hidden) return val[0][prop];
              else return null;
          }

      };

      return {
          restrict: 'E',
          require: 'ngModel',
          scope: {
            columnmap: '='
          },
          link: link,
          template: template
      };
  };

  angular.module('directivesModule')
    .directive('tableHelperWithNgModel', tableHelperWithNgModel);

}());
