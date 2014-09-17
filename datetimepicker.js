/*

This datetimepicker is a fork from Ron Liu's angularjs-bootstrap-datetimepicker (https://github.com/ron-liu/angularjs-bootstrap-datetimepicker)
It is a quick update to expose more features of the original forked project, add new features like range checking, and make it compatible with bootstrap 3.2

This datetimepicker is a simple angular wrapper of bootstrap datetimepicker(https://github.com/smalot/bootstrap-datetimepicker). 
It depends on the following stuffs:
1. bootstrap.css 2 or 3 
2. bootstrap-datetimepicker.css
3. jquery.js
4. bootstrap.js
5. bootstrap-datetimepicker.js
6. angular.js

Sample:
	<datetimepicker ng-model='date' today-btn='true' minute-step='30' ></datetimepicker>

Revised by Daniel Garcia
9/17/2014

*/

angular.module('angularjs-bootstrap-datetimepicker', [])
// Directive to set the initial value
.directive('lkSetInitial', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs) {
        	// Check if the attribute as a value and set the model
            if(attrs.lkSetInitial) {
                $parse(attrs.ngModel).assign(scope, attrs.lkSetInitial);
            }
        }
    };
})
// Directive to pick the date time
.directive('lkDatetimepicker', function ($rootScope, $filter) {
	// Check if value is set
	function _isSet(value) {
		return !(value === null || value === undefined || value === NaN || value === '');
	};
	// Get default if not set
	function _byDefault(value, defaultValue) {
		return _isSet(value) ? value : defaultValue;
	};
	// Retrieve the current date time if or today
	function _retrieveDateTime(datetime){
		return datetime =='today' ? $filter('date')(new Date(),'yyyy-MM-dd HH:mm') : $filter('date')(datetime,'yyyy-MM-dd HH:mm');
	};
	// Return the directive
	return {
		restrict: 'E',
		scope: {
			ngModel: '=',
			startDate: '=',
			endDate: '=',
			format: '@',
			todayBtn: '@',
			weekStart: '@',
			minuteStep: '@',
			displayRemoveBtn: '@',
			fieldToTarget: '@',
			fieldId: '@'
		},
		template:
			'<div class="input-group date form_datetime col-md-5" >' +
	        '   <input size="16" type="text" style="width: 200px" class="form-control" value="" ng-model="ngModel" lk-set-initial="{{ngModel | date:\'yyyy-MM-dd HH:mm\'}}" >' +
	        '   <span class="input-group-addon" ng-if="displayRemoveBtn==\'true\'"><span class="glyphicon glyphicon-remove"></span></span>' +
			'	<span class="input-group-addon"><span class="glyphicon glyphicon-th"></span></span>' +
	        '</div>',

		link: function (scope, element, attrs) {
			// Set the element
			var $element = $(element.children()[0]);
			// Call the datetimepicker function
			$element.datetimepicker({
				format: _byDefault(scope.format, 'M, dd yyyy hh:ii'),
				startDate: _byDefault(_retrieveDateTime(scope.startDate) , null),
				endDate: _byDefault($filter('date')(scope.endDate,'yyyy-MM-dd HH:mm'), null),
				weekStart: _byDefault(scope.weekStart, '1'),
				todayBtn: _byDefault(scope.todayBtn, 'true') === 'true',
				minuteStep: parseInt(_byDefault(scope.minuteStep, '30')),
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				forceParse: 0,
				showMeridian: 1
			})
			// Set the on show event
			.on('show', function (ev) {
        		scope.$apply(function() {
        			// Apply on show
        			$element.datetimepicker('update', $filter('date')(scope.ngModel,'yyyy-MM-dd HH:mm'));
        		});
        	})
        	// Set the change date event
        	.on('changeDate', function (ev) {
        		scope.$apply(function() {
        			// Set the value of ngModel
        			scope.ngModel = ev.date;
        			// Set the field target
     				var fieldToTarget = 'datetimepicker-update-'+scope.fieldToTarget;
     				// Check if the field target is set and broadcast if the value
		   			if(_isSet(scope.fieldToTarget))
        			{
        				$rootScope.$broadcast(fieldToTarget, { value: scope.ngModel});
        			}
        			
        		});
        	});

        	// Check if the field id is set and set a watch on the update event
        	if(_isSet(scope.fieldId))
        	{
        		scope.$on('datetimepicker-update-'+scope.fieldId, function(event, args){
					// Check the value of the new date and set the newValue to match the new value if lower
	       			var newValue = Date.parse(args.value) > Date.parse(scope.ngModel) ? args.value : scope.ngModel;
        			$element.datetimepicker('update', newValue);
        		});
        	}

        	// Watch ngModel
			scope.$watch('ngModel', function (newValue, oldValue) {
				$element.datetimepicker('update', newValue);
			});

			// Watch startDate
			scope.$watch('startDate', function (newValue, oldValue) {
				$element.datetimepicker('setStartDate', _retrieveDateTime(newValue));
			});

			// Watch endDate
			scope.$watch('endDate', function (newValue, oldValue) {
				$element.datetimepicker('setEndDate', $filter('date')(newValue,'yyyy-MM-dd HH:mm'));
			});

		}
	};
})

;
