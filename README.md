# Kibana Metric Visualization to show Percentages with images - Plugin

This is a Metric visualization (visType for Kibana, version 4.3+) that allows
displaying an image to show the % (For instance, 50% equals a half-empty/half-full
(depending on your mood) glass of wine).

If you really liked this and feel like making a donation : <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=juan.carniglia@gmail.com&lc=AR&item_name=JuanCarniglia&item_number=1006&currency_code=USD&bn=PP-DonationsBF:btn_donate_LG.gif:NonHosted">
<img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" alt="Contribute!" />
</a>

If you need a modified version, or one that works on a previous Kibana release,
please let me know.

![Screenshot](screenshot2.png)

Using the image of a wine bottle.

![Screenshot](screenshot.png)

This time with a fuel container.

(All images are GNU and created by me).

##Installation Steps

You can just copy the kbn_percent_nice_vis folder into KIBANA_HOME/src/plugins)
and run kibana.

** Note 1: this plugins requires numeral.js
** If you don't have it, you can just `npm install -g numeral` or install the plugin.
Surely, you already have it.

** Note 2: You have to copy all images folder (from public/img) to:

```
[Kibana Home Folder]/optimize/bundles/src/ui/public/images/kbn_percent_nice_vis
```
So that you end up with:

```
[Kibana Home Folder]/optimize/bundles/src/ui/public/images/kbn_percent_nice_vis/fuelContainer
and
[Kibana Home Folder]/optimize/bundles/src/ui/public/images/kbn_percent_nice_vis/wineBottle
```

** Note that in NTFS file systems, file paths that exceed 260 characters will
fail with cp, you have to use ROBOCOPY:

```
robocopy /S build/kbn_percent_nice_vis KIBANA_FOLDER_PATH/installedPlugins/kbn_percent_nice_vis
```

** Also note that if npm run build fails, with a rsync.js error, it is likelly
that you don't have RSYNC.EXE installed in your system, and also that you don't
have it on your PATH environment variable.

Install it from https://www.itefix.net/cwrsync and run:

```
set PATH=%PATH%;{rsync installation directory}\bin
```

##How does it work

In order to work this plugins needs a simple Schema configuration:

- One Metric Parameter (Dividend)
- One bucket that acts as the divisor.

- A Json to set some things up:

```
[
  { "text" : "CUENTA","numeralFormat" : "%00,0","ranges" : [
    { "min" : 0, "max":5000, "valueColor" : "blue"},
    { "min" : 5000, "max": 10000, "valueColor" : "cyan"}
    ]
    ,"image" : "fuelContainer"
  }
]
```

In this example, the JSON string sets up:

  - A label (string) or title.
  - The color of the numeric value (based on a range).
  - An optional numeric Format (for instance, to display currency or something else).
  - An image (image set, actually) (Right now, wineBottle or fuelContainer).

The image can be any image at the images folder. This is to say, if you want
to have a new set of images, you just have to create the folder and the images.

For instance:

```
[Kibana Home Folder]/optimize/bundles/src/ui/public/images/kbn_percent_nice_vis/myPicture
```

Inside that folder:

- myPicture_0.png
- myPicture_10.png
- myPicture_20.png
- myPicture_30.png
- myPicture_40.png
- myPicture_50.png
- myPicture_60.png
- myPicture_70.png
- myPicture_80.png
- myPicture_90.png
- myPicture_100.png

It is quite simple really. The image will be resized to around 30x100 px.

You can also choose whether to show pictures at all, and change Label and Value
font size.

Check out numeral format options at NumeralJS documentation. <http://numeraljs.com/>.

Remember to surround each field name with double quotes, and to copy the images to the bundled-up kibana folder (as stated above).
