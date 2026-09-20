// Client-side error reporting (generic — logs to console)
(function(){if(typeof window==='undefined'||window.__errHooked)return;window.__errHooked=1;addEventListener('error',function(e){if(e.error)console.error('[client error]',e.error)});addEventListener('unhandledrejection',function(e){console.error('[unhandled rejection]',e.reason)});})();
