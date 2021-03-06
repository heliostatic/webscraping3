Books = new Mongo.Collection()

if (Meteor.isClient) {

  Meteor.call('webScrape', function(error,result){
    if(error){
      console.log("error", error);
    };

    console.log(result);
    Meteor.call('webScrape2', function(error, result2){
      if (error){
        console.log("error", error);
      };
      console.log(result2)
      Session.set("scraper2", result2);

    })
    Session.set("scraper", result);
  });

  Template.scraper.helpers({
    bookTitles: function(){
      return Session.get("scraper");
    },
    bookRatings: function(){
      return Session.get("scraper2")
    },
    scrapeIsNotFinished: function(){
      return !Session.get("scraper");
    }
  })

  Meteor.Spinner.options={
    className:'spinner',
    top: 'auto',
  }
    }


    if (Meteor.isServer) {
      Meteor.startup(function () {
        var cheerio = Meteor.npmRequire('cheerio');

        Meteor.methods({

          webScrape: function (){
            result = Meteor.http.get("https://www.bookbub.com/ebook-deals/latest");
            $ = cheerio.load(result.content);
            var titles = [];
            var count = 0;
            for(i=30000; i<33000; i++){
              var resp= $('#promotion-' + i + '> div.col-sm-9 > h5 > a').text();

              if (resp != "" ){
                var url= "https://r.bookbub.com/promotion_site_active_check/" + i + "?retailer_id=1"
                var result2 = Meteor.http.get(url);
                $1 = cheerio.load(result2.content);
                var resp2 = $1('#avgRating > span > a > span').text();
                console.log(resp2)


                titles[count] = resp + resp2
                count = count + 1;
                Books.insert({Title: resp, url: url})
              }
            }
            var newline = titles.join("\n");
            return newline;

          }

    })
  });
}
