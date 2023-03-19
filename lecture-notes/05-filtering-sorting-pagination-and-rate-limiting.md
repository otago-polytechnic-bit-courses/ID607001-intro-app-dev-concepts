# 05: Filtering, Sorting, Pagination and Rate Limiting

Lecture video can be found here -

## Filtering

**Filtering** in an **API** refers to the process of selectively retrieving data from a collection of resources based on specified criteria. This is often done by specifying parameters in the **API** request that instruct the server to filter the data and return only the items that match the specified criteria.

For example, an **API** that provides a collection of institutions may allow the client, i.e., **Postman** to filter the institutions based on certain attributes such as **name**, **region**, or **country**. The client can specify the desired filters as parameters in the request, and the server will return only the products that match those filters.

```js
const getInstitutions = async (req, res) => {
  try {
    const query = {
      include: {
        departments: true,
      },
    };

    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          in: req.query.name || undefined,
        },
        region: {
          in: req.query.region || undefined,
        },
        country: {
          in: req.query.country || undefined,
        },
      };
    }

    const institutions = await prisma.institution.findMany(query);

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    return res.json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example **GET** request that returns all institutions that have the word **"University"** in their name: `http://localhost:3000/api/institutions?name=University`

## Sorting

Sorting enables end-users to quickly find the items they are looking for, especially in large collections of resources. End-users can see the most relevant or important items, rather than having to manually search through the entire collection.

Sorting is often used in combination with filtering to further refine the results returned by an API. By combining both filtering and sorting.

```js
const getInstitutions = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "name";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const query = {
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        departments: true,
      },
    };

    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          in: req.query.name || undefined,
        },
        region: {
          in: req.query.region || undefined,
        },
        country: {
          in: req.query.country || undefined,
        },
      };
    }

    const institutions = await prisma.institution.findMany(query);

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    return res.json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example **GET** request that returns all institutions that have the word **"University"** in their name, sorted by **name** in **ascending** order: `http://localhost:3000/api/institutions?name=University&sortBy=name&sortOrder=asc`

## Pagination

**Pagination** in an API refers to the process of dividing a large set of data into smaller, more manageable pieces or pages. This allows end-users to retrieve a subset of the data at a time, rather than having to request and process the entire dataset at once.

In a typical pagination implementation, the end-user specifies the desired page size (i.e. the number of items to retrieve per page) and the page number (i.e. the current page). The server then retrieves the specified page of data from the dataset and returns it to the client.

```js
const paginationDefault = {
  amount: 10, // The number of items per page
  page: 1, // The page number
};

const getInstitutions = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "name";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";

    const amount = req.query.amount || paginationDefault.amount;
    const page = req.query.page || paginationDefault.page;

    const query = {
      take: Number(amount),
      skip: (Number(page) - 1) * Number(amount),
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        departments: true,
      },
    };

    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          in: req.query.name || undefined,
        },
        region: {
          in: req.query.region || undefined,
        },
        country: {
          in: req.query.country || undefined,
        },
      };
    }

    const institutions = await prisma.institution.findMany(query);

    if (institutions.length === 0) {
      return res.status(200).json({ msg: "No institutions found" });
    }

    const hasNextPage = institutions.length === Number(amount);

    return res.json({
      data: institutions,
      nextPage: hasNextPage ? Number(page) + 1 : null,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example **GET** request that returns the first 15 institutions that have the word **"University"** in their name, sorted by **name** in **ascending** order: `http://localhost:3000/api/institutions?name=University&sortBy=name&sortOrder=asc&amount=15&page=1`

## Rate Limiting

**Rate limiting** is a mechanism that allows an API to control the number of requests made by a client. This is useful for preventing malicious clients from making too many requests and overwhelming the server.

In this section, we will use the **express-rate-limit** package to implement rate limiting in our API.

```bash
npm install express-rate-limit
```

In **app.js**, add the following code:

```js
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

In Postman, make a **GET** request to `http://localhost:3000/api/institutions` 6 times. You should see the following response:

```json
{
  "message": "Too many requests, please try again later."
}
```

Change the `max` value in to 100.

# Formative Assessment

Continue working on the **formative assessments** branch.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

## Task 1

Add the code above.

## Task 2

Implement filtering, sorting and pagination in the **GET** request handler for **departments** and **courses**.

## Task 3

In preparation for the first **summative assessment**, provide an overview of your chosen API in the **README.md** file. The overview should include the following:

- A description of the API
- A list of the API's data models. This includes the name of the model, the attributes and their data types, and the relationships between the models
- A list of the API's endpoints
