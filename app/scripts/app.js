'use strict';

/**
 * @ngdoc overview
 * @name gjStepperApp
 * @description
 * # gjStepperApp
 *
 * Main module of the application.
 */

function GenerateformInput() {
        return {
            restrict : 'E',
            replace : true,
            transclude : true,
            require :['ngModel','^?form'],
            scope:{
                fname : "@",
                lable : "@",
                placeholder : "@",
                class : "@",
                value : "=ngModel",
                flexSize: "@",
                floatLable:"@",
                minlength : '@',
                isRequired : '@',
                disable : '=',
                readonly :'='
            },
            link: function(scope,element,attr,ctrl){
                    
              var ngModelCtrl = ctrl[0];
              var formCtrl = ctrl[1];
              if(formCtrl!==null){
                scope.formName =formCtrl.$name;
              }

            },
            template: '<md-input-container >'
                      +'  <label>{{fname}}</label>'
                      +'  <input name="{{fname}}" ng-model="value" '
                      +'      type="text" server-error'
                      +'      data-aria-label="{{fname }}"'
                      +'      data-ng-minlength="{{minlength && minlength }}"'
                      +'      data-ng-required="isRequired"'
                      +'      data-ng-readonly="readonly"'
                      +'      data-ng-disabled="disable && disable">'
                      +'    {{formName[fname].$error}}'
                      +'  <div ng-messages="formName[fname].$error" ng-if="formName[fname].$touched">'
                      +'    <div ng-messages-include="error-messages"></div>{{errorMessages}}'
                      +'  </div>'
                      +'</md-input-container>'
          }

}


angular
  .module('gjStepperApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'smStepper'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })        .directive('gjInput', [GenerateformInput]);
