# 03: Deployment

## Render

[Render](https://render.com/) is a **cloud platform** that makes it easy for developers and teams to deploy and host **web applications** and **static websites**.

### Getting Started

Sign up for a **Render** account at [https://dashboard.render.com/](https://dashboard.render.com/). Use your **GitHub** to sign up.

![](<../resources (ignore)/img/03/render-1.PNG>)

Click the **New +** button, then click the **Web Service** link.

![](<../resources (ignore)/img/03/render-2.PNG>)

Connect to your **s2-23-playground** repository. When you push to this repository, **Render** will automatically deploy your **web service**. It is called **Continuous Deployment**.

![](<../resources (ignore)/img/03/render-3.PNG>)

Name your **web service**. For example, **id607001-your learner username**.

![](<../resources (ignore)/img/03/render-4.PNG>)

Change the **Runtime** to **Node**, **Build Command** to `npm install`, and **Start Command** to `node index.js`.

![](<../resources (ignore)/img/03/render-5.PNG>)

Leave the **Instance Type** as **Free**.

![](<../resources (ignore)/img/03/render-6.PNG>)

Click on the **Create Web Service** button.

![](<../resources (ignore)/img/03/render-7.PNG>)

Keep an eye on the logs. Your **web service** is ready when you see the following message.

```bash
Server is listening on port 3000.
Your service is live 🎉
```

![](<../resources (ignore)/img/03/render-8.PNG>)

Scroll to the top of the page and click on your **web service's** URL.

![](<../resources (ignore)/img/03/render-9.PNG>)

You should see the following page. **Note:** Your **web service's** URL will be different.

![](<../resources (ignore)/img/03/render-10.PNG>)

## Formative Assessment

1. Implement the above.