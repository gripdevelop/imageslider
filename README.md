# ImageSlider

## Summary

Change an unordered list to a slideshow. This is not limited to the content of the list-items. Images are used in the demo's, but this can be anything you want.
It uses the jQuery-library, but that's just to make the selectors and bindings easier. It should be easy enough to modify it to vanilla javascript.

Call the function as such: 

    // create variable (easy to use multiple instances of the imageslider on one page)
    var slideshow = new imageSlider(selector, options);

    // initialize on document-ready
    $(document).ready(function() { slideshow.init(); }); 

Selector is the block which contains the ul

### Options:

* **itemWidth:** Specify the width of one item (required)
* **numItems:** Specify the number of items (required)
* **container:** By default the navigation is placed as a child of the ``selector``-element (just like the slider is), but if you want the navigation to be in a different element than the slider, you can use ``selector`` for that element and ``container`` for the element in which the ``ul`` for the slider is (optional)
* **slideshow:** Set ``true`` for automatic slideshow (optional, defaults to ``false``)
* **speed:** Set the speed in milliseconds (optional, defaults to ``600``)
* **waittime:** Set the waittime between slides in milliseconds (optional, default to ``5000``)
* **skipLastItems:** Set the number of items that have to be skipped on the end. This can be used to show multiple slides at once (see demo2) to prevent the empty slide at the end (optional, defaults to ``0``)
* **responsive:** Set ``true`` for responsive slider (optional, defaults to ``false``). Only works on reload for now, so resizing the browser-window won't help you here :)
* **responsiveWidth:** Set the width below which the responsive slider should trigger (optional, use in combination with ``responsive``)
* **slideNavigationClass:** Set the classname of the slider's navigation (pager) (optional, defaults to ``imageslide-navigation``)
* **slideNavigationPrevClass:** Set the classname of the slider's previous button (optional, defaults to ``imageslide-previous-item``)
* **slideNavigationNextClass:** Set the classname of the slider's next button (optional, defaults to ``imageslide-next-item``)
