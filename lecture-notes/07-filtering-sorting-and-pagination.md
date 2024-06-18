# 07: Filtering, Sorting and Pagination

## Previous Class

Link to the previous class: [06: Validation](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/06-validation.md)

## Filtering

**Filtering** in an **API** refers to the process of selectively retrieving data from a collection of resources based on specified criteria. This is often done by specifying parameters in the **API** request that instruct the server to filter the data and return only the items that match the specified criteria.

For example, an **API** that provides a collection of institutions may allow the client, i.e., **Postman** to filter the institutions based on certain fields such as **name**, **region**, or **country**. The client can specify the desired filters as parameters in the request, and the server will return only the products that match those filters.

---

### Institution Controller

In the `controllers` directory, open the `institution.js` file and update the `getInstitutions` function to include filtering based on the `name`, `region`, or `country` fields.

```js
const getInstitutions = async (req, res) => {
  try {
    // An object to store the query parameters
    const query = {
      include: {
        departments: true,
      },
    };

    // Check if the query parameters are present in the request
    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          equals: req.query.name || undefined,
        },
        region: {
          equals: req.query.region || undefined,
        },
        country: {
          equals: req.query.country || undefined,
        },
      };
    }

    // Retrieve institutions based on the query parameters
    const institutions = await prisma.institution.findMany(query);

    if (!institutions) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example `GET` request that returns all institutions where the `name` is **Otago Polytechnic** - <http://localhost:3000/api/institutions?name=Otago Polytechnic>.

---

## Sorting

Sorting enables end-users to quickly find the items they are looking for, especially in large collections of resources. End-users can see the most relevant or important items, rather than having to manually search through the entire collection.

Sorting is often used in combination with filtering to further refine the results returned by an API. By combining both filtering and sorting.

---

### Institution Controller

In the `controllers` directory, open the `institution.js` file and update the `getInstitutions` function to include sorting based on a specified field and order.

```js
const getInstitutions = async (req, res) => {
  try {
    // Default sorting parameters
    const sortBy = req.query.sortBy || "id"; // Default sort by id if not specified
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc"; // Default sort order is ascending if not specified

    // An object to store the query parameters
    const query = {
      orderBy: {
        // Sorting parameters
        [sortBy]: sortOrder,
      },
      include: {
        departments: true,
      },
    };

    // Check if the query parameters are present in the request
    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          equals: req.query.name || undefined,
        },
        region: {
          equals: req.query.region || undefined,
        },
        country: {
          equals: req.query.country || undefined,
        },
      };
    }

    // Retrieve institutions based on the query parameters
    const institutions = await prisma.institution.findMany(query);

    if (!institutions) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    return res.status(200).json({
      data: institutions,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example `GET` request that returns all institutions sorted by `name` in `asc` or ascending order - <http://localhost:3000/api/institutions?sortBy=name&sortOrder=asc>.

---

## Pagination

**Pagination** in an API refers to the process of dividing a large set of data into smaller, more manageable pieces or pages. It allows end-users to retrieve a subset of the data at a time, rather than having to request and process the entire dataset at once.

In a typical pagination implementation, the end-user specifies the desired page size (i.e. the number of items to retrieve per page) and the page number (i.e. the current page). The server then retrieves the specified page of data from the dataset and returns it to the client.

---

### Institution Controller

In the `controllers` directory, open the `institution.js` file and update the `getInstitutions` function to include pagination based on the specified page size and page number.

```js
const getInstitutions = async (req, res) => {
  const paginationDefault = {
    amount: 10, // Default number of items per page
    page: 1, // Default page number
  };

  try {
    // Default sorting parameters
    const sortBy = req.query.sortBy || "id"; // Default sort by id if not specified
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc"; // Default sort order is ascending if not specified

    // Default pagination parameters
    const amount = req.query.amount || paginationDefault.amount; // Default number of items per page if not specified
    const page = req.query.page || paginationDefault.page; // Default page number if not specified

    // An object to store the query parameters
    const query = {
      take: Number(amount), // Number of items per page
      skip: (Number(page) - 1) * Number(amount), // Number of items to skip
      orderBy: {
        // Sorting parameters
        [sortBy]: sortOrder,
      },
      include: {
        departments: true,
      },
    };

    // Check if the query parameters are present in the request
    if (req.query.name || req.query.region || req.query.country) {
      query.where = {
        name: {
          equals: req.query.name || undefined,
        },
        region: {
          equals: req.query.region || undefined,
        },
        country: {
          equals: req.query.country || undefined,
        },
      };
    }

    // Retrieve institutions based on the query parameters
    const institutions = await prisma.institution.findMany(query);

    if (!institutions) {
      return res.status(404).json({ msg: "No institutions found" });
    }

    // Check if there are more pages
    const hasNextPage = institutions.length === Number(amount);

    return res.status(200).json({
      data: institutions,
      nextPage: hasNextPage ? Number(page) + 1 : null, // Next page number. If there are no more pages, return null
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
```

Here is an example `GET` request that returns the first page of institutions with 10 items per page - <http://localhost:3000/api/institutions?amount=10&page=1>.

---

## Formative Assessment

Before you start, create a new branch called **07-formative-assessment**.

If you get stuck on any of the following tasks, feel free to use **ChatGPT** permitting, you are aware of the following:

- If you provide **ChatGPT** with a prompt that is not refined enough, it may generate a not-so-useful response
- Do not trust **ChatGPT's** responses blindly. You must still use your judgement and may need to do additional research to determine if the response is correct
- Acknowledge that you are using **ChatGPT**. In the **README.md** file, please include what prompt(s) you provided to **ChatGPT** and how you used the response(s) to help you with your work

---

### Task One

Implement the above.

### Task Two

Document the **API** in **Postman**.

---

### Submission

Create a new pull request and assign **grayson-orr** to review your practical submission. Please do not merge your own pull request.

---

## Next Class

Link to the next class: [08: Seeding and API Testing](https://github.com/otago-polytechnic-bit-courses/ID607001-intro-app-dev-concepts/blob/s2-24/lecture-notes/08-seeding-and-api-testing.md)