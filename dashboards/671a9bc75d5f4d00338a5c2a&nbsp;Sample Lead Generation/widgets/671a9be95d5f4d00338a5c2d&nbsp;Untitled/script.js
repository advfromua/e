/*
Welcome to your Widget's Script.

To learn how you can access the Widget and Dashboard objects, see the online documentation at https://sisense.dev/guides/js/extensions
*/

var newWidth = {
    "Source": 220,
    "Referral Page": 300,
    "Marketing Qualified": 300
};

var columnsToRemove = [];
var passed = -1;
var wasExecuted = false;

widget.on('processresult', function(widget, args) {
    if (!wasExecuted) {
        args.result.metadata.forEach(function(e, index) {
            if (e.panel != "scope") {
                // Use the column name directly
                var columnName = e.jaql.title;

                if (typeof(newWidth[columnName]) !== "undefined") {
                    // Initialize e.format if it doesn't exist
                    e['format'] = e['format'] || {};
                    
                    // Set the width based on the column name
                    e['format']['width'] = newWidth[columnName];
                }

                // Check if the column width is set to 0 and add to columnsToRemove
                if (e.format && e.format.width === 0) {
                    columnsToRemove.push(index);
                }
            } else {
                passed++;
            }
        });
        wasExecuted = true;
    }
});

widget.on('ready', function() {
    columnsToRemove.forEach(function(item) {
        var selector = "[class*=table-grid__cell--col-" + item + "]";
        $(selector, element).each(function(i, lmnt) {
            $(lmnt).text('');
        });
    });
});
