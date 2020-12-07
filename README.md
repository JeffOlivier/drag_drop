## If you have multiple websites, but want to have one tool to manage the social media info for each of them separately, then this is the tool for you.

_This tool is built using **JavaScript ES6**, **jQuery**, and **SASS**._

**<font color='green'>Green</font>:** icons that have been set up with a title and URL and are live on your site<br>
**<span style="color:red">Red</span>:** icons that have NOT been set up with either a title or URL or both<br>
**<span style="color:blue">Blue</span>:** icons that have been set up with a title and URL but are NOT currently being used on your site

The **_edit_** button (icon located in the upper right hand corner of each large icon) lets you edit the social media information of each icon : the URL to your social media site (eg. FB, Insta, ect) and title of the icon.

The **_Save Order_** button only becomes **_active_** when there is an actual change to be saved.

- You can rearrange the order that the icons are shown in, then hit save
- You can move an icon that is being used to the white box to remove it from being seen on your website
- You can add a new icon to your website by grabbing a red one in the white area and moving it inline with the green icons
- You can edit the URL and title of each individual icon

---

### If you want to integrate this with a database, then the below information will get you started

## DATABASE TABLES

### social_media_type

[this table contains all of the social media types that are available]

    id - SMALLINT(6) (primary key)
    name - char(100) (unique key)
    fa4icon - VARCHAR(100) [font awesome ver 4 icon code]
    fa5icon - VARCHAR(100) [font awesome ver 5 icon code]
    isGlobal - TINYINT(1) [T = show on all sites, F = specific to certain site(s) ]

| name      | fa4icon               | fa5icon     |
| --------- | --------------------- | ----------- |
| Facebook  | fa-facebook-square    | fab fa-aefb |
| Google+   | fa-google-plus-square | fab fa-aegp |
| Instagram | fa-instagram          | fab fa-aeig |
| Pinterest | fa-pinterest-square   | fab fa-aept |
| Twitter   | fa-twitter-square     | fab fa-aetw |
| YouTube   | fa-youtube-square     | fab fa-aeyt |

### social_media

[this table determins what icons are shown on what website]

    id - INT (primary key, auto increment)
    siteCode - CHAR(5) [code representing which site this SM icon belongs on]
    typeId - SMALLINT(6) (primary key) [maps to the table social_media_type column id]
    title - VARCHAR(150) [title on social media icon]
    url - VARCHAR(255) [URL to your specific SM page eg. www.facebook.com/myCompany ]
    iconrder - TINYINT(4) [the order placement of this SM icon]

    * unique key = (siteCode, typeId)

### social_media_change_log

[this table logs all changes to the social_media table and by whom]

    id - INT (primary key, auto increment)
    timestamp - DATETIME [date of the change]
    username - VARCHAR(100) [person who made the change]
    social_media_id - INT [maps to the table social_media column id]
    dbField - VARCHAR(50) [field from table social_media that was changed]
    oldData - VARCHAR(255) [original value]
    newData - VARCHAR(255) [new value]

---

# QUERY EXAMPLES

---

### Get all of the active icons for the site named 'foo' (eg. the icons currently being shown on the website)

**_note:_** _an icon order of zero indicates that it exists, but isn't shown on the website_

> SELECT id<br>
> FROM social_media<br>
> WHERE sitecode = 'foo' AND iconOrder != 0<br>
> ORDER BY iconOrder DESC

OR

> SELECT typeId, title, url, iconOrder, name<br>
> FROM social_media AS a<br>
> JOIN social_media_type AS b ON b.id = a.typeId<br>
> WHERE siteCode = 'foo' AND iconOrder != 0<br>
> ORDER BY iconOrder ASC

### Get all of the available social media icon types

> SELECT id<br>
> FROM social_media_type<br>
> WHERE isGlobal = true<br>
> ORDER BY id ASC

### Get all of the information for a _SINGLE_ social media icon on the site named 'foo'

> SELECT \*<br>
> FROM social_media<br>
> WHERE siteCode = 'foo' AND typeId = 56

### Get all of the information for a single social media icon type

> SELECT \*<br>
> FROM social_media_type<br>
> WHERE id = 3

### Get the URL for the social media icon image

> SELECT fa5icon as image_code<br>
> FROM social_media_types<br>
> WHERE id = 3

### Get the name of a social media icon (eg. facebook, instagram, etc.)

> SELECT name<br>
> FROM social_media_type<br>
> WHERE id = 3
