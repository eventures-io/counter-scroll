angular.module('website', ['ngAnimate'])
    .constant('TweenMax', TweenMax)
    .controller('MainCtrl', function ($scope) {
        $scope.pages = {
            'home': { label: 'Home', sublabel: 'Sublabel', content: 'This is page content.' },
            'about': { label: 'About', sublabel: 'Sublabel', content: 'This is page content.' },
            'contact': { label: 'Contact', sublabel: 'Sublabel', content: 'This is page content. This is page content.This is page content.This is page content.This is page content.This is page content.This is page content.This is page content.This is page content.This is page content.This is page content.This is page content.This is page content. This is page contentThis is page contentThis is page contentThis is page contentThis is page contentThis is page contentThis is page contentThis is page contentThis is page contentThis is page content' }
        };

        $scope.currentPage = 'home';
        $scope.page = $scope.pages['home'];
        $scope.isInTransit = false;

        $scope.setCurrentPage = function (page) {
            if ($scope.currentPage !== page) {
                $scope.page = $scope.pages[page];
                $scope.currentPage = page;
                $scope.isInTransit = true;
            }
        };

        $scope.isCurrentPage = function (page) {
            return $scope.currentPage === page;
        };

        $scope.$on('bgTransitionComplete', function(){
            $scope.isInTransit = false;
        });
    })
    .directive('bg', function ($window) {
        // Adapted from http://bavotasan.com/2011/full-sizebackground-image-jquery-plugin/ Thanks @bavotasan!
        var linker = function (scope, element, attrs) {
            var resizeBG = function () {
                var bgwidth = element.width();
                var bgheight = element.height();

                var winwidth = $window.innerWidth;
                var winheight = $window.innerHeight;

                var widthratio = winwidth / bgwidth;
                var heightratio = winheight / bgheight;

                var widthdiff = heightratio * bgwidth;
                var heightdiff = widthratio * bgheight;

                if (heightdiff > winheight) {
                    element.css({
                        width: winwidth + 'px',
                        height: heightdiff + 'px'
                    });
                } else {
                    element.css({
                        width: widthdiff + 'px',
                        height: winheight + 'px'
                    });
                }
            }

            resizeBG();

            var windowElement = angular.element($window);
            windowElement.resize(resizeBG);
        }

        return {
            restrict: 'A',
            link: linker
        };
    })
    .animation('.bg-animation', function ($window, $rootScope, $document, TweenMax) {
        return {
            enter: function (element, done) {
                TweenMax.fromTo(element, 0.5, { top: $window.innerHeight}, {top: 0, onStart: function () {
                    //onStart: start the panel-animation when the bg-animation starts. alternative: onComplete
                    $rootScope.$apply(function(){
                        $rootScope.$broadcast('bgTransitionComplete');
                    });
                    done();
                }});
            },
            leave: function (element, done) {
                TweenMax.to(element, 0.5, {top: -$window.innerHeight, onComplete: done});
            }
        };
    })
    .animation('.panel-animation', function (TweenMax, $window, $document) {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.4, { opacity: 0, onComplete: done });
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');
                    TweenMax.fromTo(element, 0.5, { opacity: 0, top: -element.height() }, { opacity: 0.8, top: (getViewHeight($window, $document)*40)/100 , onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });



function getViewHeight($window, $document) {
    var windowWidth = 0, windowHeight = 0;
    if( typeof( $window.innerWidth ) == 'number' ) {
        //Non-IE
        windowWidth = $window.innerWidth;
        windowHeight = $window.innerHeight;
    } else if( $document.documentElement && ( $document.documentElement.clientWidth || $document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        windowWidth = $document.documentElement.clientWidth;
        windowHeight = $document.documentElement.clientHeight;
    } else if( $document.body && ( $document.body.clientWidth || $document.body.clientHeight ) ) {
        //IE 4 compatible
        windowWidth = $document.body.clientWidth;
        windowHeight = $document.body.clientHeight;
    }

    return windowHeight;
}
