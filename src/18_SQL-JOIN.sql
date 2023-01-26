
-- 說明
-- `products` 23 筆
-- `categories` 10 筆

-- ***JOIN***

SELECT COUNT(1) FROM `products` JOIN `categories`;
-- 1 筆 product 對應 10 筆 categories -> 230 筆

-- JOIN
SELECT * FROM `products` JOIN `categories` ON `products`.`category_sid`=`categories`.`sid`;
-- 23 筆 product 對應相應的 category_id -> 23 筆
-- 用一般 JOIN 的話結果一樣，若 product 的 category_id 無法對應到 categories 的 sid ，則該產品資料不會出現

-- JOIN : `products` `categories` 位置對調 -> 用一般 JOIN 的話結果一樣，呈現的表格不一樣
SELECT * FROM `categories` JOIN `products` ON `categories`.`sid`=`products`.`category_sid`;

-- AS : 別名
SELECT * FROM `products` AS p JOIN `categories` AS c ON p.`category_sid`=c.`sid`;

-- 只要特定欄位，單一欄位(cate.name)後可以取欄位別名(c_name)
SELECT p.*, c.name cate_name FROM `products` AS p JOIN `categories` AS c ON p.`category_sid`=c.`sid`;


-- ***LEFT OUTER JOIN***

SELECT p.*, c.name cate_name FROM `products` AS p LEFT JOIN `categories` AS c ON p.`category_sid`=c.`sid`;
-- LEFT JOIN : 先出現的為 left: products，後出現的為 right: categories，left 的所有資料都會出現(出現不限一次)，沒對應到為 NULL

-- LEFT JOIN : `products` `categories` 位置對調
SELECT p.*, c.name cate_name FROM `categories` AS p LEFT JOIN `products` AS c ON p.`category_sid`=c.`sid`;
-- LEFT JOIN : 先出現的為 left: categories，後出現的為 right: products，left 的所有資料都會出現(出現不限一次)，沒對應到為 NULL

-- 所有訂單對應的訂單明細
SELECT * FROM `orders` LEFT JOIN `order_details` as od ON orders.sid=od.order_sid;

-- 11號訂單對應的訂單明細、產品名稱
SELECT od.*, p.bookname FROM `orders` LEFT JOIN `order_details` as od ON orders.sid=od.order_sid LEFT JOIN products as p ON od.product_sid=p.sid WHERE orders.sid=11;

-- 1號顧客對應的訂單明細、產品名稱
SELECT o.member_sid, od.*, p.bookname FROM `orders` AS o LEFT JOIN order_details AS od ON o.sid = od.order_sid LEFT JOIN products AS p ON od.product_sid=p.sid WHERE o.member_sid=1;

-- 1號顧客對應的訂單明細、產品名稱，產品名稱不要重複(依照資料欄位順序，先出現的做代表)
SELECT o.member_sid, od.*, p.bookname FROM `orders` AS o LEFT JOIN order_details AS od ON o.sid = od.order_sid LEFT JOIN products AS p ON od.product_sid=p.sid WHERE o.member_sid=1 GROUP BY p.sid;

-- 1號顧客對應的訂單明細、產品名稱，產品名稱不要重複，時間排序
SELECT o.member_sid, o.order_date, od.*, p.bookname FROM `orders` AS o LEFT JOIN order_details AS od ON o.sid = od.order_sid LEFT JOIN products AS p ON od.product_sid=p.sid WHERE o.member_sid=1 GROUP BY p.sid ORDER BY o.order_date ASC;

-- 所有商品中，3號顧客對應的喜好商品
SELECT * FROM `products` p LEFT JOIN product_likes pl ON p.sid=pl.product_id AND pl.member_id=3;