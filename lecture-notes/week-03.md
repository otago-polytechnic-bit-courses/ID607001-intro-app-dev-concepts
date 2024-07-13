# Week 03

## Previous Class

Link to the previous class: [Week 02](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-02.md)

---

## Render

[Render](https://render.com/) is a **cloud platform** that makes it easy for developers and teams to deploy and host **web applications** and **static websites**.

---

### Setup

Sign up for a **Render** account at [https://dashboard.render.com/](https://dashboard.render.com/). Use your **GitHub** account to sign up.

![](<../resources (ignore)/img/03/render-1.PNG>)

Click the **New +** button, then click the **Web Service** link.

![](<../resources (ignore)/img/03/render-2.PNG>)

By default, it will select **Build and deploy from a Git repository**. Click the **Next** button.

![](<../resources (ignore)/img/03/render-3.PNG>)

Connect to your **s2-24-intro-app-dev-repo-GitHub username** repository. When you push to this repository, **Render** will automatically deploy your **web service**. It is called **Continuous Deployment**.

![](<../resources (ignore)/img/03/render-4.PNG>)

Name your **web service**. For example, **s2-24-intro-app-dev-repo-GitHub username**. Change the **Language** to **Node**.

![](<../resources (ignore)/img/03/render-5.PNG>)

Change the **Build Command** to `npm install` and **Start Command** to `node app.js`. Leave the **Instance Type** as **Free**.

![](<../resources (ignore)/img/03/render-6.PNG>)

Click on the **Deploy Web Service** button.

![](<../resources (ignore)/img/03/render-7.PNG>)

Keep an eye on the logs. Your **web service** is ready when you see the following message.

```bash
Server is listening on port 10000. Visit http://localhost:10000 
Your service is live 🎉
```

![](<../resources (ignore)/img/03/render-8.PNG>)

Scroll to the top of the page and click on your **web service's** URL.

![](<../resources (ignore)/img/03/render-9.PNG>)

You should see the following page. **Note:** Your **web service's** URL will be different.

![](<../resources (ignore)/img/03/render-10.PNG>)

> **Resource:** <https://render.com/docs>

---

## Next Class

Link to the next class: [Week 04](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/week-04.md)
