from flask import Flask
from bs4 import BeautifulSoup
import requests
import re
from flask import request
import pyrebase
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


regex = re.compile(r'[\n\r\t]')

# app.config['SERVER_NAME'] = 'localhost:9000/'

@app.route('/newsapi', methods=['POST'])
def api():
    if request.method == 'POST':
        uid = request.get_json()
        # print("post : ", data)
        config = {
        "apiKey": "###################################",
        "authDomain": "###################################",
        "databaseURL": "###################################",
        "storageBucket": "###################################",
        }

        firebase = pyrebase.initialize_app(config)
        db = firebase.database()
        List = db.child("users").child(uid).child("platform_selected").get()
        news = []
        List = List.val()
        ## InShorts News
        if 1 in List:
            news1 = []
            url1 = requests.get('https://inshorts.com/en/read').text
            soup1 = BeautifulSoup(url1, 'lxml')

            i = 0
            for title in soup1.find_all('div',class_='card-stack'):
                for heading in soup1.find_all('div',class_="news-card-title news-right-box"):
                    info={}
                    headline=heading.a.span.text
                    info['headline'] = headline
                    info['source'] = 'inShorts'
                    info['linkToNews'] = '#'
                    news1.append(info)
                    i += 1
                    if i == 15:
                        break
                i = 0
                for image in soup1.find_all('div',class_="news-card-image"):
                    news1[i]['imageURL'] = image['style'][23 : len(image['style']) - 2]
                    i += 1
                    if i == 15 :
                        break
                i = 0
                for body in soup1.find_all('div', class_="news-card-content news-right-box"):
                    articleBody = body.div.text
                    news1[i]['body'] = regex.sub(" ", articleBody)
                    i += 1
                    if i == 15 :
                        break
            i = 0
            for posted in soup1.find_all(class_="news-card-author-time news-card-author-time-in-title"):
                for date in posted.find('span', {'clas' : 'date'}):
                        news1[i]['date'] = date[0:6]
                        i += 1
                        if i == 15:
                            break
                if i == 15:
                    break
            news += news1

        ##print(len(news1))
        ##print(news1[0])

        ## NDTV  News
        if 2 in List:
            url2 = requests.get('https://www.ndtv.com/latest').text
            soup2 = BeautifulSoup(url2, 'lxml')
            i = 0
            news2 = []

            for heading in soup2.find_all('div', class_="news_Itm-cont"):
                info = {}
                info['headline'] = heading.h2.a.text
                info['body'] = regex.sub(" ", heading.p.text)
                info['source'] = 'NDTV'
                i += 1
                news2.append(info)
                if i == 15 :
                    break
            for posted in soup2.find_all('span', class_="posted-by"):
                for i in range(0, 15):
                    temp = posted.text[:-1].split('|')[1].split()
                    news2[i]['date'] =  temp[2][0:2] + " " + temp[1][0:3]
                    if i == 15:
                        break
                break
            i = 0
            for image in soup2.find_all('div', class_="news_Itm-img"):
                news2[i]['linkToNews'] = image.a["href"]
                news2[i]['imageURL'] = image.a.img["src"]

                i += 1
                if i == 15:
                    break
            news += news2
        ##print(news2[0])

        ## Times Of India News
        if 3 in List:
            url3 = requests.get('https://timesofindia.indiatimes.com/briefs').text
            soup3 = BeautifulSoup(url3, 'lxml')
            i = 0
            news3 = []

            for title in soup3.find_all('div', {'data-section_name' : '/briefs'}):
                info = {}
                info['imageURL'] = title.a.div.img['src']
                info['body'] =  regex.sub(" ", title.p.a.text)
                info['headline'] = title.h2.a.text
                string = 'https://timesofindia.indiatimes.com' + str(title.a['href'])
                ## Extracting date
                url31 = requests.get(string).text
                # soup31 = BeautifulSoup(url31, 'lxml')

                # for temp in soup31.find('div',class_="yYIu- byline"):
                #     if str(temp)[0] == '<' :
                #         continue
                #     else:
                #         print(temp.span)
                #         tempList = temp.split()
                #         print(tempList)
                #         if tempList[0] == ' ':
                #             tempStr = tempList[2].split(" ")
                #             info["date"] =   tempStr[3][0:2] + " " + tempStr[2]
                #         else:
                #             tempStr = tempList[1].split(" ")
                #             info["date"] =   tempStr[3][0:2] + " " + tempStr[2]
            ##            print(info['date'])
                info['date'] = ''
                info['linkToNews'] = string
                info['source'] = 'TOI'

                news3.append(info)

                i += 1

                if i == 15 :
                        break
            news += news3

        ##print(news3)


        ## India Today News
        if 4 in List:
            url4 = requests.get('https://www.indiatoday.in/india').text
            soup4 = BeautifulSoup(url4, 'lxml')
            i = 0
            news4 = []
            List1 = []

            for image in soup4.find_all('div', class_='pic'):
                info = {}
                if image.img['src'][51] == 's':
                    info['imageURL'] = image.img['src']
                ##    print(info['imageURL'])
                    info['source'] = 'India Today'
                    news4.append(info)
                    List1.append(i)

                i += 1
                if i == 15 :
                        break
            i = 0
            k = 0
            for headline in soup4.find_all('div', class_='detail'):
                if i in List1:
                    news4[k]['headline'] = headline.h2['title']
                    news4[k]['body'] = regex.sub(" ", str(headline.p)[3: -5])
                    news4[k]['linkToNews'] = 'https://www.indiatoday.in' + headline.h2.a['href']

                    string = 'https://www.indiatoday.in' + headline.h2.a['href']
                    url41 = requests.get(string).text
                    soup41 = BeautifulSoup(url41, 'lxml')
                    for temp in soup41.find('span',class_="update-data"):
                        tempStr = temp.split(" ")
                        news4[k]['date'] = tempStr[2][0:2] + " " + tempStr[1][0:3] 

            ##        print(news4[k]['date'])

                    k += 1
                i += 1

                if i == 15:
                    break
            news += news4
            # print(news4[0])

        ## ZEE News
        if 5 in List:
            url5 = requests.get('https://zeenews.india.com/latest-news').text
            soup5 = BeautifulSoup(url5, 'lxml')
            i = 0
            news5 = []

            for title in soup5.find_all('div', class_="section-article margin-bt30px clearfix"):
                info = {}
                info['imageURL'] = title.a.img['src']
                info['body'] = regex.sub(" ", title.div.p.text)
                info['headline'] = title.div.h3.a.text
                info['linkToNews'] = 'https://zeenews.india.com' + title.a['href']
                info['source'] = 'ZEE News'
                tempStr = title.div.span.text.split(" ")
            ##    print(tempStr)
                info['date'] =  tempStr[1][0:2] + " " +  tempStr[0][3:]
            ##    print(info['date'])
                news5.append(info)


                i += 1

                if i == 15 :
                    break
            news += news5

        # print(news[0])

        return {'news' : news}

