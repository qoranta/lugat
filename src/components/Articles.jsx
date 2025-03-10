import React from "react";

const json2html = (input, word, dictEntry) => {
  var pos = dictEntry?.shortening_pos;
  if (pos != null) {
      input = input.replace(/~/g, pos == 0 ? word : word.substring(0, pos));
  }
  
  input = input.replace(/\\n/g, '\n');

  if (dictEntry?.dict == 'crh-ru') {
      input = input.replace(/(лингв|перен|физ|хим|бот|биол|зоо|грам|геогр|астр|шк|мат|анат|ирон|этн|стр|рел|посл|уст)\./g,'<i class="spec">$&</i>');
      input = input.replace(/\/(.+?)\//g,'<i class="spec">$1</i>');
  }
  

  //input = input.replace(/(ср|см)\. (.+)$/mg,
  //   (_str, p1, p2, _offset, _s) => {
  //       var words = p2.split(/\s*,\s*/);
  //       var links = '';
  //       words.forEach((val, _index, _arr) => {
  //           links += '<a href="#" onclick="return app.insert_and_submit(\''+val+'\');" >'+val+'</a>, ';
  //       });
  //       return '<i class="link">'+p1+'.</i> '+links.slice(0, -2);
  //   }
  //);
  input = input.replace(/^(.[^)].+?) - (.+?)$/mg,'<b>$1</b> $2');
  input = input.replace('◊', '\n◊\n'); 
  input = input.replace(/\n/g, '<br/>');
  input = input.replace(/; /g, '<br/>');
  return input;
}

const accentize = (word, article) => {
  var pos = article.accent_pos;
  if (pos) {
      return word.substring(0, pos) + "\u0301" + word.substring(pos);
  } else {
      return word;
  }
}

const Articles = ({ result, skipWord }) => {
  return (
        <div className="translation__desc">{result.articles?.map((article, index) => (
                      <div key={`article-${result.word + index}`}>
                        {!skipWord && (<b>{accentize(result.word, article)}</b>)}
                        <div className="article" dangerouslySetInnerHTML={{__html: json2html(article.text, result.word, result)}}>
                        </div>
                      </div>
                  ))}
        </div>
  );
};

export default Articles;
