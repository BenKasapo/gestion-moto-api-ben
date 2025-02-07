const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const generateUniqueCode = require('../services/generateUniqueCode');

const prisma = new PrismaClient()

// Associations requests handlers

const createAssociation = async (association) => {
  try {
    await prisma.association.create({
      data: {
        ...association,
        programme: {
          connect: {
            nom: association.programme,
          },
        },
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const retrieveAssociations = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const associations = await prisma.association.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          notifications: {
            select: {
              id: true,
              titre: true,
            },
          },
          succursales: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      })
      return associations
    } else {
      const associations = await prisma.association.findMany({
        include: {
          notifications: {
            select: {
              id: true,
              titre: true,
            },
          },
          succursales: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      })
      return associations
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveAssociation = async (association_id) => {
  try {
    const association = await prisma.association.findUnique({
      where: {
        id: parseInt(association_id),
      },
      include: {
        notifications: {
          select: {
            id: true,
            titre: true,
          },
        },
        succursales: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    })
    if (!association) {
      return null
    }
    return association
  } catch (error) {
    console.error(error)
  }
}
const changeAssociation = async (association_id, datas) => {
  try {
    // Commencez une transaction
    await prisma.$transaction(async (prisma) => {
      // Récupérez l'ancien nom de l'association
      const association = await prisma.association.findUnique({
        where: {
          id: parseInt(association_id),
        },
      })

      if (!association) {
        throw new Error("Association not found")
      }

      const oldNom = association.nom
      const newNom = datas.nom

      // Mettez à jour le nom de l'association
      await prisma.association.update({
        where: {
          id: parseInt(association_id),
        },
        data: {
          ...datas,
          programme: {
            connect: {
              nom: datas.programme,
            },
          },
        },
      })

      // Mettez à jour les références dans les autres tables
      const relatedNotifs = await prisma.notification.findMany()
      if (relatedNotifs.length !== 0) {
        await prisma.notification.updateMany({
          where: {
            association_label: oldNom,
          },
          data: {
            association_label: newNom,
          },
        })
      }

      const relatedContribs = await prisma.cotisation.findMany()
      if (relatedContribs.length !== 0) {
        await prisma.cotisation.updateMany({
          where: {
            association_label: oldNom,
          },
          data: {
            association_label: newNom,
          },
        })
      }

      const relatedUsers = await prisma.utilisateur.findMany()
      if (relatedUsers.length !== 0) {
        await prisma.utilisateur.updateMany({
          where: {
            association_label: oldNom,
          },
          data: {
            association_label: newNom,
          },
        })
      }

      /*    const relatedBranches = await prisma.succursale.findMany()
      if (relatedBranches.length !== 0) {
        await prisma.succursale.updateMany({
          where: {
            association_id: parseInt(association_id),
          },
          data: {
            
            association: {
              connect: {
                id: parseInt(association_id),
              },
            },
          },
        })
      } */
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeAssociation = async (association_id) => {
  try {
    await prisma.association.delete({
      where: {
        id: parseInt(association_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const createAssociationBranch = async (association_id, datas) => {
  try {
    await prisma.succursale.create({
      data: {
        ...datas,
        association: {
          connect: {
            id: parseInt(association_id),
          },
        },
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const retrieveAssociationBranches = async (association_id, query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      if (association_id) {
        const branches = await prisma.succursale.findMany({
          where: {
            association_id: parseInt(association_id),
          },
          skip: (page - 1) * limit,
          take: limit,
        })
        return branches
      }
      const branches = await prisma.succursale.findMany({
        skip: (page - 1) * limit,
        take: limit,
      })
      return branches
    } else {
      const branches = await prisma.succursale.findMany()
      return branches
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveAssociationBranch = async (association_id, branch_id) => {
  try {
    const branch = await prisma.succursale.findUnique({
      where: {
        association_id: parseInt(association_id),
        id: parseInt(branch_id),
      },
    })
    return branch
  } catch (error) {
    console.error(error)
  }
}
const changeAssociationBranch = async (association_id, branch_id, datas) => {
  try {
    await prisma.succursale.update({
      where: {
        association_id: parseInt(association_id),
        id: parseInt(branch_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeAssociationBranch = async (association_id, branch_id) => {
  try {
    await prisma.succursale.delete({
      where: {
        association_id: parseInt(association_id),
        id: parseInt(branch_id),
      },
    })
  } catch (error) {
    console.error(error)
    return false
  }
}

const createAssociationNotif = async (association_id, datas) => {
  try {
    await prisma.notification.create({
      data: {
        association: {
          connect: {
            id: parseInt(association_id),
          },
        },
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const retrieveAssociationNotifs = async (association_id, query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const notifs = await prisma.notification.findMany({
        where: {
          association_id: parseInt(association_id),
        },
        skip: (page - 1) * limit,
        take: limit,
      })
      return notifs
    } else {
      const notifs = await prisma.notification.findMany()
      return notifs
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveAssociationNotif = async (association_id, notif_id) => {
  try {
    const notif = await prisma.notification.findUnique({
      where: {
        association_id: parseInt(association_id),
        id: parseInt(notif_id),
      },
    })
    return notif
  } catch (error) {
    console.error(error)
  }
}
const changeAssociationNotif = async (association_id, notif_id, datas) => {
  try {
    await prisma.notification.update({
      where: {
        association_id: parseInt(association_id),
        id: parseInt(notif_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeAssociationNotif = async (association_id, notif_id) => {
  try {
    await prisma.notification.delete({
      where: {
        association_id: parseInt(association_id),
        id: parseInt(notif_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// Contributions requests handlers

const createContribution = async (datas) => {
  try {
    const existingAssociation = await prisma.association.findUnique({
      where: {
        nom: datas.association,
      },
    })

    if (!existingAssociation) {
      return {
        success: false,
        message: "Association does not exist",
      }
    }
    // Check if the contribution already exists
    const existingContribution = await prisma.cotisation.findFirst({
      where: {
        association: {
          nom: datas.association,
        },
        type_cotisation: {
          label: datas.type_cotisation,
        },
      },
    })

    if (existingContribution) {
      // Contribution already exists, return an error
      return {
        success: false,
        message: "Contribution already exists",
        contributionId: existingContribution.id, // Optionally include existing contribution ID
      }
    }
    await prisma.cotisation.create({
      data: {
        ...datas,
        association: {
          connect: {
            nom: datas.association,
          },
        },
        type_cotisation: {
          connect: {
            label: datas.type_cotisation,
          },
        },
      },
    })
    return {
      success: true,
      message: "Contribution created successfully",
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: "An error occurred while creating the contribution",
      error: error.message, // Include the error message for debugging
    }
  }
}
const retrieveContributions = async (association_id, query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      if (association_id) {
        const contribs = await prisma.cotisation.findMany({
          where: {
            association_id: parseInt(association_id),
          },
          include: {
            paiements: {
              select: {
                reference: true,
                utilisateur_id: true,
                montant: true,
                devise: true,
              },
            },
          },
          skip: (page - 1) * limit,
          take: limit,
        })
        return contribs
      }
      const contribs = await prisma.cotisation.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          paiements: {
            select: {
              reference: true,
              utilisateur_id: true,
              montant: true,
              devise: true,
            },
          },
        },
      })
      return contribs
    } else {
      const contribs = await prisma.cotisation.findMany({
        include: {
          paiements: {
            select: {
              reference: true,
              utilisateur_id: true,
              montant: true,
              devise: true,
            },
          },
        },
      })
      return contribs
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveContribution = async (contrib_id) => {
  try {
    const contrib = await prisma.cotisation.findUnique({
      where: {
        id: parseInt(contrib_id),
      },
      include: {
        paiements: {
          select: {
            reference: true,
            utilisateur_id: true,
            montant: true,
            devise: true,
          },
        },
      },
    })
    return contrib
  } catch (error) {
    console.error(error)
  }
}
const changeContribution = async (contrib_id, datas) => {
  try {
    await prisma.cotisation.update({
      where: {
        id: parseInt(contrib_id),
      },
      data: {
        ...datas,
        association: {
          connect: {
            nom: datas.association,
          },
        },
        type_cotisation: {
          connect: {
            label: datas.type_cotisation,
          },
        },
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeContribution = async (contrib_id) => {
  try {
    await prisma.cotisation.delete({
      where: {
        id: parseInt(contrib_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const createContributionType = async (datas) => {
  try {
    await prisma.type_Cotisation.create({
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const retrieveContributionTypes = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const types = await prisma.type_Cotisation.findMany({
        skip: (page - 1) * limit,
        take: limit,
      })
      return types
    } else {
      const types = await prisma.type_Cotisation.findMany()
      return types
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveContributionType = async (type_id) => {
  try {
    const type = await prisma.type_Cotisation.findUnique({
      where: {
        id: parseInt(type_id),
      },
    })
    return type
  } catch (error) {
    console.error(error)
  }
}
const changeContributionType = async (type_id, datas) => {
  try {
    await prisma.type_Cotisation.update({
      where: {
        id: parseInt(type_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeContributionType = async (type_id) => {
  try {
    await prisma.type_Cotisation.delete({
      where: {
        id: parseInt(type_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// Notifications requests handlers

const createNotification = async (datas) => {
  try {
    await prisma.notification.create({
      data: {
        ...datas,
        association: {
          connect: {
            nom: datas.association,
          },
        },
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const retrieveNotifications = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const notifs = await prisma.notification.findMany({
        skip: (page - 1) * limit,
        take: limit,
      })
      return notifs
    } else {
      const notifs = await prisma.notification.findMany()
      return notifs
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveNotification = async (notif_id) => {
  try {
    const notif = await prisma.notification.findUnique({
      where: {
        id: parseInt(notif_id),
      },
    })
    return notif
  } catch (error) {
    console.error(error)
  }
}
const changeNotification = async (notif_id, datas) => {
  try {
    await prisma.notification.update({
      where: {
        id: parseInt(notif_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeNotification = async (notif_id) => {
  try {
    await prisma.notification.delete({
      where: {
        id: parseInt(notif_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// Payments requests handlers

/* const createPayment = async (datas) => {
  try {
    await prisma.paiement.create({
      data: {
        ...datas,
        cotisation: {
          connect: {
            id: datas.cotisation,
          },
        },
        utilisateur: {
          connect: {
            id: datas.utilisateur,
          },
        },
        periode: {
          connect: {
            id: datas.periode,
          },
        },
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
} */
const createPayment = async (datas) => {
  try {
    // Fetch the association_label for the utilisateur_id
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: datas.utilisateur }, // Use the utilisateur ID from datas
      select: { association_label: true }, // Only fetch the association_label
    })

    if (!utilisateur || !utilisateur.association_label) {
      throw new Error("Utilisateur ou association non trouvée")
    }

    // Create the payment including the association_label
    await prisma.paiement.create({
      data: {
        ...datas,
        association_label: utilisateur.association_label, // Automatically set association_label
        cotisation: {
          connect: {
            id: datas.cotisation,
          },
        },
        utilisateur: {
          connect: {
            id: datas.utilisateur,
          },
        },
        periode: {
          connect: {
            id: datas.periode,
          },
        },
      },
    })

    return true // Payment created successfully
  } catch (error) {
    console.error(error)
    return false // Indicate failure in payment creation
  }
}

const retrievePayments = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const payments = await prisma.paiement.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          status: "PAID",
        },
      })
      return payments
    } else {
      const payments = await prisma.paiement.findMany({
        where: {
          status: "PAID",
        },
      })
      return payments
    }
  } catch (error) {
    console.error(error)
  }
}

const retrievePendingPayments = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const payments = await prisma.paiement.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          status: "PENDING",
        },
      })
      return payments
    } else {
      const payments = await prisma.paiement.findMany({
        where: {
          status: "PENDING",
        },
      })
      return payments
    }
  } catch (error) {
    console.error(error)
  }
}

const retrievePayment = async (payment_id) => {
  try {
    const payment = await prisma.paiement.findUnique({
      where: {
        id: parseInt(payment_id),
        status: "PAID",
      },
    })
    return payment
  } catch (error) {
    console.error(error)
  }
}
const retrievePaymentByPeriodId = async (period_id) => {
  try {
    const payment = await prisma.paiement.findFirst({
      where: {
        periode_id: parseInt(period_id),
        status: "PENDING",
      },
      select: {
        id: true,
      },
    })
    console.log(" payment got from period --------------- ", payment)
    return payment
  } catch (error) {
    console.error(error)
  }
}

const retrievePaymentsForDriver = async (user_id) => {
  try {
    const payment = await prisma.paiement.findMany({
      where: {
        utilisateur_id: user_id,
        status: "PAID",
      },
    })
    return payment
  } catch (error) {
    console.error(error)
  }
}

const changePayment = async (payment_id, datas) => {
  try {
    await prisma.paiement.update({
      where: {
        id: parseInt(payment_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const removePayment = async (payment_id) => {
  try {
    await prisma.paiement.delete({
      where: {
        id: parseInt(payment_id),
      },
    })
    return true
  } catch (error) {
    console.log(error)
    console.error(error)
    return false
  }
}

// Permissions requests handlers

const createPermission = async (datas) => {
  try {
    await prisma.permission.create({
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const retrievePermission = async (permission_id) => {
  try {
    const permission = await prisma.permission.findUnique({
      where: {
        id: parseInt(permission_id),
      },
      include: {
        profils_utilisateurs: {
          select: {
            label: true,
          },
        },
      },
    })
    return permission
  } catch (error) {
    console.error(error)
  }
}
const changePermission = async (permission_id, datas) => {
  try {
    await prisma.permission.update({
      where: {
        id: parseInt(permission_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removePermission = async (permission_id) => {
  try {
    await prisma.permission.delete({
      where: {
        id: parseInt(permission_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const retrievePermissions = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const perms = await prisma.permission.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          profils_utilisateurs: {
            select: {
              label: true,
            },
          },
        },
      })
      return perms
    } else {
      const perms = await prisma.permission.findMany({
        include: {
          profils_utilisateurs: {
            select: {
              label: true,
            },
          },
        },
      })
      return perms
    }
  } catch (error) {
    console.error(error)
  }
}

// Programs requests handlers

const createProgram = async (program) => {
  try {
    await prisma.programme.create({
      data: {
        ...program,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false // Failure to create an association entity
  }
}
const retrievePrograms = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const programs = await prisma.programme.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          associations: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      })
      return programs
    } else {
      const programs = await prisma.programme.findMany({
        include: {
          associations: {
            select: {
              id: true,
              nom: true,
            },
          },
        },
      })
      return programs
    }
  } catch (error) {
    console.error(error)
  }
}
const retrieveProgram = async (program_id) => {
  try {
    const program = await prisma.programme.findUnique({
      where: {
        id: parseInt(program_id),
      },
      include: {
        associations: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    })
    if (!program) {
      return null
    }
    return program
  } catch (error) {
    console.error(error)
  }
}

const retrieveProgramByAssociation = async (associationLabel) => {
  try {
    const assoc = await prisma.association.findUnique({
      where: { nom: associationLabel },
      include: { programme: true }, // Including the program details
    })
    if (!assoc) {
      return "Association does not exist"
    } else return assoc.programme
  } catch (error) {
    console.error(error)
  }
}
const changeProgram = async (program_id, datas) => {
  try {
    await prisma.programme.update({
      where: {
        id: parseInt(program_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeProgram = async (program_label) => {
  try {
    const label = await prisma.programme.findUnique({
      where: {
        id: Number(program_label),
      },
    })
    await prisma.association.updateMany({
      where: {
        programme_label: label.nom,
      },
      data: {
        programme_label: null,
      },
    })
    await prisma.programme.delete({
      where: {
        nom: label.nom,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

// Users requests handlers

/* const createUser = async (datas) => {
  try {
    const hashedPassword = bcrypt.hashSync(datas.password, 15)

    const userData = {
      ...datas,
      date_naissance: new Date(datas.date_naissance),
      password: hashedPassword,
      profil: {
        connect: {
          label: datas.profil,
        },
      },
    }

    if (datas.association) {
      userData.association = {
        connect: {
          nom: datas.association,
        },
      }
    }

    await prisma.utilisateur.create({
      data: userData,
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
} */

  const createUser = async (datas) => {
    const {
      firstname,
      lastname,
      gender,
      phone1,
      phone2,
      street,
      city,
      postalCode,
      country,
      state,
      use,
      username,
      password,
      businessProfile,
      biometrics,
    } = datas;
    try {
      // Check if the email or username already exists
      const existingUser = await prisma.utilisateur.findFirst({
        where: {
          OR: [
            { email: datas.email },
            { username: datas.username },
          ],
        },
      });

      if (existingUser) {
        // Determine which field is already in use
        const message =
          existingUser.email === datas.email
            ? "Email already in use. Please use another email."
            : "Username already in use. Please use another username.";
        return { success: false, message };
      }

      const uniqueCode = await generateUniqueCode();
  
      // If email does not exist, proceed with user creation
      const hashedPassword = bcrypt.hashSync(datas.password, 15);

      if (datas.use === 'individual' && datas.businessProfile) {
        return { success: false, message: 'Business profile should not be provided for individual use.' };
    }
    
    const userData = {
        firstname: datas.firstname,
        lastname: datas.lastname,
        email: datas.email,
        username: datas.username,
        password: hashedPassword,
        phone1: datas.phone1,
        phone2: datas.phone2,
        gender: datas.gender,
        street: datas.street,
        city: datas.city,
        postalCode: datas.postalCode,
        country: datas.country,
        state: datas.state,
        use: datas.use,
        code: uniqueCode,
        business: datas.use === 'business' ? {
            create: {
                ...datas.businessProfile,
            },
        } : undefined,
        biometrics: datas.use != 'admin' 
        ? datas.biometrics
          ? {
              create: {
                face_data: { 
                  create: { 
                    ...datas.biometrics.face_data 
                  } 
                },
                fingers_data: { 
                  createMany: { 
                    data: datas.biometrics.fingers_data 
                  } 
                },
              },
            }
          : undefined
        : undefined
      }

    if(datas.profil){
        userData.profil = {
            connect: {
                label: datas.profil,
            },
        };
    }
    
    if (datas.association) {
        userData.association = {
            connect: {
                nom: datas.association,
            },
        };
    }
    
  
      await prisma.utilisateur.create({
        data: userData,
      });
  
      return { success: true, message: "User created successfully." }; // Return success message
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred while creating the user." }; // Return error message
    }
  };
  
  const retrieveUsers = async (query) => {
    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const profile = query.profile;
  
    try {
      let users;
  
      if (profile && page && limit) {
        users = await prisma.utilisateur.findMany({
          where: {
            profil_label: profile,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
      } else if (profile) {
        users = await prisma.utilisateur.findMany({
          where: {
            profil_label: profile,
          },
          include: {
            business: true,
            biometrics: {
              include: {
                face_data: true,
                fingers_data: true,
              },
            },
          },
        });
      } else if (page && limit) {
        users = await prisma.utilisateur.findMany({
          skip: (page - 1) * limit,
          take: limit,
          include: {
            business: true,
            biometrics: {
              include: {
                face_data: true,
                fingers_data: true,
              },
            },
          },
        });
      } else {
        users = await prisma.utilisateur.findMany({
          include: {
            business: true,
            biometrics: {
              include: {
                face_data: true,
                fingers_data: true,
              },
            },
          },
        });
      }
  
      return users;
    } catch (error) {
      console.error(error);
    }
  };
  
/* const retrieveUser = async (user_id) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: {
        id: user_id,
      },
      include: {
        id:true,
        business: true,
        biometrics: {
          include: {
            face_data: true,
            fingers_data: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error retrieving user:", error);
  }
}; */
const retrieveUser = async (user_id) => {
  try {
    // First query: Fetch specific fields
    const userFields = await prisma.utilisateur.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        // Include other specific fields
      },
    });

    // Second query: Fetch related data
    const userRelatedData = await prisma.utilisateur.findUnique({
      where: {
        id: user_id,
      },
      include: {
        business: true,
        biometrics: {
          include: {
            face_data: true,
            fingers_data: true,
          },
        },
      },
    });

    // Combine the data from both queries
    const userData = {
      ...userFields,
      ...userRelatedData,
    };

    return userData;
  } catch (error) {
    console.error("Error retrieving user:", error);
  }
};

const getUsersByAssociation = async (association) => {
  try {
    return await prisma.utilisateur.findMany({
      where: {
        association_label: association,
        include: { business: true, biometrics: { include: { face_data: true, fingers_data: true } } },

      },
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

/* const changeUser = async (user_id, datas) => {
  const {
    email,
    username,
    name,
    phone1,
    phone2,
    password,
    street,
    city,
    postalCode,
    country,
    state,
    use,
    business,
    biometrics,
    profil,
    association,
  } = datas;
  
  try {
    await prisma.utilisateur.update({
      where: {
        id: user_id,
      },
      data: {
        email,
        username,
        name,
        phone1,
        phone2,
        password,
        street,
        city,
        postalCode,
        country,
        state,
        use,
        business: business
          ? {
              upsert: {
                create: {
                  activityName: business.activityName,
                  registration: business.registration,
                  sector: business.sector,
                  activitySize: business.activitySize,
                  businessPhone1: business.businessPhone1,
                  businessStreet: business.businessStreet,
                  businessCountry: business.businessCountry,
                  businessState: business.businessState,
                  businessCity: business.businessCity,
                  merchantCode: business.merchantCode,
                },
                update: {
                  activityName: business.activityName,
                  registration: business.registration,
                  sector: business.sector,
                  activitySize: business.activitySize,
                  businessPhone1: business.businessPhone1,
                  businessStreet: business.businessStreet,
                  businessCountry: business.businessCountry,
                  businessState: business.businessState,
                  businessCity: business.businessCity,
                  merchantCode: business.merchantCode,
                },
              },
            }
          : undefined,
          biometrics: biometrics
          ? {
              upsert: {
                create: {
                  face_data: { 
                    create: {
                      pos: biometrics.face_data?.pos, 
                      data: biometrics.face_data?.data,
                    },
                  },
                  fingers_data: { 
                    create: biometrics.fingers_data?.map((finger) => ({
                      pos: finger.pos,
                      data: finger.data,
                    })) || [],
                  },
                },
                update: {
                  face_data: { 
                    update: {
                      pos: biometrics.face_data?.pos, 
                      data: biometrics.face_data?.data,
                    },
                  },
                  fingers_data: { 
                    deleteMany: {},
                    create: biometrics.fingers_data?.map((finger) => ({
                      pos: finger.pos,
                      data: finger.data,
                    })) || [], 
                  },
                },
              },
            }
          : undefined,
        // Profil update
        profil: profil
          ? {
              upsert: {
                create: {
                  label: profil,
                },
                update: {
                  label: profil,
                },
              },
            }
          : undefined,
        // Association update
        association: association
          ? {
              upsert: {
                create: {
                  nom: association,
                },
                update: {
                  nom: association,
                },
              },
            }
          : undefined,
      },
    });
  
   return true
  } catch (error) {
    console.error("Error updating user:", error);
    return false
  }
  
}; */
/* const changeUser = async (user_id, datas) => {
  const {
    email,
    username,
    name,
    phone1,
    phone2,
    password,
    street,
    city,
    postalCode,
    country,
    state,
    use,
    business,
    biometrics,
    profil,
    association,
  } = datas;
  
  try {
    await prisma.utilisateur.update({
      where: {
        id: user_id,
      },
      data: {
        email,
        username,
        name,
        phone1,
        phone2,
        password,
        street,
        city,
        postalCode,
        country,
        state,
        use,
        business: business
          ? {
              update: {
                activityName: business.activityName,
                registration: business.registration,
                sector: business.sector,
                activitySize: business.activitySize,
                businessPhone1: business.businessPhone1,
                businessStreet: business.businessStreet,
                businessCountry: business.businessCountry,
                businessState: business.businessState,
                businessCity: business.businessCity,
                merchantCode: business.merchantCode,
              }
            }
          : undefined,
        biometrics: biometrics
          ? {
              update: {
                face_data: {
                  update: {
                    pos: biometrics.face_data?.pos, 
                    data: biometrics.face_data?.data,
                  }
                },
                fingers_data: {
                  deleteMany: {},
                  create: biometrics.fingers_data?.map((finger) => ({
                    pos: finger.pos,
                    data: finger.data,
                  })) || []
                }
              }
            }
          : undefined,
        profil: profil
          ? {
              update: {
                label: profil,
              }
            }
          : undefined,
        association: association
          ? {
              update: {
                nom: association,
              }
            }
          : undefined,
      },
    });
  
    return true;
  } catch (error) {
    console.error("Error updating user:", error); 
    if (error.code === 'P2002') {
       // Prisma unique constraint violation error 
       console.error('Unique constraint violation:', error.meta); 
    } 
    else if (error.code === 'P2025') { 
      // Record to update not found error
      console.error('Record not found-----------------------------------:', error.meta); } 
      else { console.error('Unknown error:', error); 
    }
    return false;
  }
}; */
/* const changeUser = async (user_id, datas) => {
  const {
    email,
    username,
    name,
    phone1,
    phone2,
    password,
    street,
    city,
    postalCode,
    country,
    state,
    use,
    business,
    biometrics,
    profil,
    association,
  } = datas;

  // Build the data object dynamically
  const updateData = {};

  // Only add fields to updateData if they exist in datas
  if (email) updateData.email = email;
  if (username) updateData.username = username;
  if (name) updateData.name = name;
  if (phone1) updateData.phone1 = phone1;
  if (phone2) updateData.phone2 = phone2;
  if (password) updateData.password = password;
  if (street) updateData.street = street;
  if (city) updateData.city = city;
  if (postalCode) updateData.postalCode = postalCode;
  if (country) updateData.country = country;
  if (state) updateData.state = state;
  if (use) updateData.use = use;

  if (business) {
    updateData.business = {
      update: {
        activityName: business.activityName,
        registration: business.registration,
        sector: business.sector,
        activitySize: business.activitySize,
        businessPhone1: business.businessPhone1,
        businessStreet: business.businessStreet,
        businessCountry: business.businessCountry,
        businessState: business.businessState,
        businessCity: business.businessCity,
        merchantCode: business.merchantCode,
      }
    };
  }

  if (biometrics) {
    updateData.biometrics = {
      update: {
        face_data: {
          update: {
            pos: biometrics.face_data?.pos, 
            data: biometrics.face_data?.data,
          }
        },
        fingers_data: {
          deleteMany: {},
          create: biometrics.fingers_data?.map((finger) => ({
            pos: finger.pos,
            data: finger.data,
          })) || []
        }
      }
    };
  }

  if (profil) {
    updateData.profil = {
      update: {
        label: profil,
      }
    };
  }

  if (association) {
    updateData.association = {
      update: {
        nom: association,
      }
    };
  }

  try {
    await prisma.utilisateur.update({
      where: {
        id: user_id,
      },
      data: updateData,
    });

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}; */
/* const changeUser = async (user_id, datas) => {
  const {
    email,
    username,
    name,
    phone1,
    phone2,
    password,
    street,
    city,
    postalCode,
    country,
    state,
    use,
    business,
    biometrics,
    profil,
    association,
  } = datas;

  // Build the data object dynamically
  const updateData = {};

  // Only add fields to updateData if they exist in datas
  if (email) updateData.email = email;
  if (username) updateData.username = username;
  if (name) updateData.name = name;
  if (phone1) updateData.phone1 = phone1;
  if (phone2) updateData.phone2 = phone2;
  if (password) updateData.password = password;
  if (street) updateData.street = street;
  if (city) updateData.city = city;
  if (postalCode) updateData.postalCode = postalCode;
  if (country) updateData.country = country;
  if (state) updateData.state = state;
  if (use) updateData.use = use;

  if (business) {
    updateData.business = {
      update: {
        activityName: business.activityName,
        registration: business.registration,
        sector: business.sector,
        activitySize: business.activitySize,
        businessPhone1: business.businessPhone1,
        businessStreet: business.businessStreet,
        businessCountry: business.businessCountry,
        businessState: business.businessState,
        businessCity: business.businessCity,
        merchantCode: business.merchantCode,
      }
    };
  }

  if (biometrics) {
    updateData.biometrics = {
      update: {
        face_data: {
          update: {
            pos: biometrics.face_data?.pos,
            data: biometrics.face_data?.data,
          }
        },
        fingers_data: {
          deleteMany: {},
          create: biometrics.fingers_data?.map((finger) => ({
            pos: finger.pos,
            data: finger.data,
          })) || []
        }
      }
    };
  }

  // Add profil if it doesn't exist
  if (profil) {
    updateData.profil = {
      connectOrCreate: {
        where: {
          label: profil,
        },
        create: {
          label: profil,
        }
      }
    };
  }

  // Add association if it doesn't exist
  if (association) {
    updateData.association = {
      connectOrCreate: {
        where: {
          nom: association,
        },
        create: {
          nom: association,
        }
      }
    };
  }

  try {
    await prisma.utilisateur.update({
      where: {
        id: user_id,
      },
      data: updateData,
    });

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}; */
const changeUser = async (user_id, datas) => {
  const {
    email,
    username,
    name,
    phone1,
    phone2,
    password,
    street,
    city,
    postalCode,
    country,
    state,
    use,
    business,
    biometrics,
    profil,
    association,
  } = datas;

  // Build the data object dynamically
  const updateData = {};

  // Only add fields to updateData if they exist in datas
  if (email) updateData.email = email;
  if (username) updateData.username = username;
  if (name) updateData.name = name;
  if (phone1) updateData.phone1 = phone1;
  if (phone2) updateData.phone2 = phone2;
  if (password) updateData.password = password;
  if (street) updateData.street = street;
  if (city) updateData.city = city;
  if (postalCode) updateData.postalCode = postalCode;
  if (country) updateData.country = country;
  if (state) updateData.state = state;
  if (use) updateData.use = use;

  if (business) {
    updateData.business = {
      update: {
        activityName: business.activityName,
        registration: business.registration,
        sector: business.sector,
        activitySize: business.activitySize,
        businessPhone1: business.businessPhone1,
        businessStreet: business.businessStreet,
        businessCountry: business.businessCountry,
        businessState: business.businessState,
        businessCity: business.businessCity,
        merchantCode: business.merchantCode,
      },
    };
  }

  if (biometrics) {
    updateData.biometrics = {
      update: {
        face_data: {
          update: {
            pos: biometrics.face_data?.pos,
            data: biometrics.face_data?.data,
          },
        },
        fingers_data: {
          deleteMany: {},
          create: biometrics.fingers_data?.map((finger) => ({
            pos: finger.pos,
            data: finger.data,
          })) || [],
        },
      },
    };
  }

  // Connect to existing profil if it exists
  if (profil) {
    updateData.profil = {
      connect: {
        label: profil,
      },
    };
  }

  // Connect to existing association if it exists
  if (association) {
    updateData.association = {
      connect: {
        nom: association,
      },
    };
  }

  try {
    await prisma.utilisateur.update({
      where: {
        id: user_id,
      },
      data: updateData,
    });

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};



/* const changeUser = async (user_id, datas) => {
  try {
    await prisma.utilisateur.update({
      where: {
        id: user_id,
      },
      data: {
        //...datas,
        email: datas.email,
        username: datas.username,
        name: datas.name,
        phone1: datas.phone1,
        phone2: datas.phone2,
        password: datas.password,
        street: datas.street,
        city: datas.city,
        postalCode: datas.postalCode,
        country: datas.country,
        state: datas.state,
        use: datas.use,
        business: datas.business,
        biometrics: datas.biometrics,
        business: datas.business,
        profil: profil ? { connect: { label: profil } } : null,
        association: association ? { connect: { nom: association } } : undefined,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
} */
const removeUser = async (user_id) => {
  try {
    await prisma.utilisateur.delete({
      where: {
        id: user_id,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const findUserByMailOrPhone = async (email, phone) => {
  try {
    const user = await prisma.utilisateur.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
            },
          },
          {
            phone1: {
              equals: phone,
            },
          },
        ],
      },
    })
    return user
  } catch (error) {
    console.error(error)
  }
}

const createUserProfile = async (datas) => {
  try {
    await prisma.profil_Utilisateur.create({
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const retrieveUserProfiles = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  try {
    if (page && limit) {
      const profiles = await prisma.profil_Utilisateur.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          utilisateur: {
            select: {
              id: true,
            },
          },
          permissions: {
            select: {
              label: true,
            },
          },
        },
      })
      return profiles
    }
    const profiles = await prisma.profil_Utilisateur.findMany({
      include: {
        utilisateur: {
          select: {
            id: true,
          },
        },
        permissions: {
          select: {
            label: true,
          },
        },
      },
    })
    return profiles
  } catch (error) {
    console.error(error)
  }
}
const retrieveUserProfile = async (profile_id) => {
  try {
    const profile = await prisma.profil_Utilisateur.findUnique({
      where: {
        id: parseInt(profile_id),
      },
      include: {
        utilisateur: {
          select: {
            id: true,
          },
        },
        permissions: {
          select: {
            label: true,
          },
        },
      },
    })
    return profile
  } catch (error) {
    console.error(error)
  }
}
const changeUserProfile = async (profile_id, datas) => {
  try {
    await prisma.profil_Utilisateur.update({
      where: {
        id: parseInt(profile_id),
      },
      data: {
        ...datas,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
const removeUserProfile = async (profile_id) => {
  try {
    await prisma.profil_Utilisateur.delete({
      where: {
        id: parseInt(profile_id),
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const updateUserPassword = async (identifier, hashedPassword) => {
  return await prisma.utilisateur.update({
    where: { id: identifier },
    data: { password: hashedPassword },
  })
}

const find_UserByMailOrPhone = async (email, phone1) => {
  return await prisma.utilisateur.findFirst({
    where: {
      OR: [email ? { email } : {}, phone1 ? { phone1 } : {}],
    },
  })
}

// Succursale Functions
const createSuccursale = async (nom, association_id) => {
  return await prisma.succursale.create({
    data: {
      nom,
      association: {
        connect: { id: association_id },
      },
    },
  })
}

const getSuccursales = async () => {
  return await prisma.succursale.findMany()
}

const getSuccursaleById = async (id) => {
  return await prisma.succursale.findUnique({
    where: { id },
  })
}

const updateSuccursale = async (id, nom, association_id) => {
  return await prisma.succursale.update({
    where: { id },
    data: {
      nom,
      association: {
        connect: { id: association_id },
      },
    },
  })
}

const deleteSuccursale = async (id) => {
  return await prisma.succursale.delete({
    where: { id },
  })
}

//Periods handlers

// Créer une nouvelle période
// Créer une nouvelle période
const createPeriod = async (label, id_cotisation) => {
  // Rechercher la cotisation avec les relations nécessaires
  const cotisation = await prisma.cotisation.findUnique({
    where: {
      id: id_cotisation,
    },
    include: {
      association: true,
      type_cotisation: true,
      paiements: true, // Inclure les paiements si nécessaire
    },
  })

  // Vérifier si la cotisation existe
  if (!cotisation) {
    throw new Error(`Cotisation with ID ${id_cotisation} not found.`)
  }

  // Créer une nouvelle période et connecter la cotisation
  return await prisma.periode.create({
    data: {
      label,
      cotisation: {
        connect: {
          id: cotisation.id,
        },
      },
    },
    include: {
      cotisation: true, // Inclure les détails de la cotisation dans la réponse
    },
  })
}

// Récupérer toutes les périodes
const retrievePeriods = async () => {
  return await prisma.Periode.findMany()
}

// Récupérer une période par son id
const retrievePeriod = async (id) => {
  const idAsInt = parseInt(id)
  return await prisma.Periode.findUnique({
    where: { id: idAsInt },
  })
}

// Mettre à jour une période existante
const changePeriod = async (id, label, id_cotisation) => {
  return await prisma.Periode.update({
    where: { id },
    data: {
      label,
      cotisation: {
        connect: { id: id_cotisation },
      },
    },
  })
}

// Supprimer une période

const removePeriod = async (id) => {
  var response = false
  try {
    response = await prisma.Periode.delete({
      where: {
        id: id,
      },
    })
    console.log("mmmmm")
    console.log(response)
    return response
  } catch (error) {
    console.log(response)
    return response
  }
}

//Periode non payé par un user
const retrieveUnpaidPeriods = async (id_user, id_cotisation) => {
  try {
    // Retrieve pending payments for the user and cotisation
    const pendingPayments = await prisma.paiement.findMany({
      where: {
        utilisateur: {
          id: id_user,
        },
        status: "PAID",
        cotisation: {
          id: id_cotisation,
        },
      },
      select: {
        periode_id: true, // Ensure 'periode_id' exists in the schema
      },
    })

    console.log("Pending Payments:", pendingPayments)

    // Retrieve all periods associated with the cotisation
    const periodsForCotisation = await prisma.periode.findMany({
      where: {
        cotisation: {
          id: id_cotisation,
        },
      },
    })

    // Filter unpaid periods
    const unpaidPeriods = periodsForCotisation.filter((period) => {
      return !pendingPayments.some(
        (payment) => payment.periode_id === period.id
      )
    })

    return unpaidPeriods // Return unpaid periods
  } catch (error) {
    console.log(error)
    console.error("Error retrieving unpaid periods:", error)
    throw new Error("Could not retrieve unpaid periods: " + error.message)
  }
}

/* const retrieveUnpaidPeriods = async (id_user, id_cotisation) => {
  const paiementIds = await prisma.paiement.findMany({
    where: {
      status: "PENDING",
      utilisateur: {
        id: id_user,
      },
      cotisation: {
        id: id_cotisation,
      },
    },

    select: {
      periode_id: true,
    },
  })
  console.log("LES PAIMENTS")
  console.log(paiementIds)

  const periods_for_cotisation = await prisma.Periode.findMany({
    where: {
      cotisation: {
        id: id_cotisation,
      },
    },
  })

  //console.log("LES PERIODES")
  //console.log(periods_for_cotisation)

  const unpaid_periods = periods_for_cotisation.filter((period) => {
    return !paiementIds.some((paiement) => paiement.periode_id === period.id)
  })

  //return
 

  return unpaid_periods
}
 */
const retrievePeriodsForCotisation = async (id_cotisation) => {
  return (periods = await prisma.Periode.findMany({
    where: {
      id_cotisation: id_cotisation,
    },
    include: {
      cotisation: true,
    },
  }))
}

/*vehicules*/

const createVehicle = async (data) => {
  try {
    const vehicleData = {
      marque: data.marque,
      modele: data.modele,
      immatriculation: data.immatriculation,
      utilisateur_id: data.utilisateur_id,
    }

    await prisma.vehicule.create({
      data: vehicleData,
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const retrieveVehicles = async (query) => {
  const page = parseInt(query.page)
  const limit = parseInt(query.limit)
  const utilisateur_id = query.utilisateur_id

  try {
    let vehicles
    if (utilisateur_id && page && limit) {
      vehicles = await prisma.vehicule.findMany({
        where: {
          utilisateur_id: utilisateur_id,
        },
        skip: (page - 1) * limit,
        take: limit,
      })
      return vehicles
    } else if (utilisateur_id) {
      vehicles = await prisma.vehicule.findMany({
        where: {
          utilisateur_id: utilisateur_id,
        },
      })
      return vehicles
    } else if (page && limit) {
      vehicles = await prisma.vehicule.findMany({
        skip: (page - 1) * limit,
        take: limit,
      })
      return vehicles
    }
    vehicles = await prisma.vehicule.findMany()
    return vehicles
  } catch (error) {
    console.error(error)
  }
}

const retrieveVehicle = async (id) => {
  try {
    const vehicle = await prisma.vehicule.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        marque: true,
        modele: true,
        immatriculation: true,
        utilisateur_id: true,
      },
    })
    return vehicle
  } catch (error) {
    console.error(error)
  }
}

const changeVehicle = async (id, data) => {
  try {
    await prisma.vehicule.update({
      where: {
        id: id,
      },
      data: {
        marque: data.marque,
        modele: data.modele,
        immatriculation: data.immatriculation,
        utilisateur_id: data.utilisateur_id,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const removeVehicle = async (id) => {
  try {
    await prisma.vehicule.delete({
      where: {
        id: id,
      },
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const retrieveVehiclesForUser = async (id_user) => {
  try {
    const vehicles = await prisma.vehicule.findMany({
      where: {
        utilisateur_id: id_user,
      },
    })
    return vehicles
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getStats = async () => {
  try {
    const totalDrivers = await prisma.utilisateur.count({
      where: {
        profil_label: "Chauffeur",
      },
    })
    const totalUsers = await prisma.utilisateur.count()
    const totalMoneyUSD = await prisma.paiement.aggregate({
      _sum: {
        montant: true,
      },
      where: {
        devise: "usd",
      },
    })
    const totalMoneyCDF = await prisma.paiement.aggregate({
      _sum: {
        montant: true,
      },
      where: {
        devise: "cdf",
      },
    })
    const totalAssociations = await prisma.association.count()
    const totalPrograms = await prisma.programme.count()

    return {
      totalDrivers,
      totalUsers,
      totalMoney: {
        USD: totalMoneyUSD._sum.montant,
        CDF: totalMoneyCDF._sum.montant,
      },
      totalAssociations,
      totalPrograms,
    }
  } catch (error) {
    return { error: "Erreur lors de la récupération des statistiques." }
  }
}

const getStatsByAssociation = async (associationLabel) => {
  const totalDrivers = await prisma.utilisateur.count({
    where: {
      association_label: associationLabel,
      profil_label: "Chauffeur",
    },
  })

  const totalMoneyUSD = await prisma.paiement.aggregate({
    where: {
      cotisation: {
        association_label: associationLabel,
      },
      devise: "USD",
    },
    _sum: {
      montant: true,
    },
  })

  const totalMoneyCDF = await prisma.paiement.aggregate({
    where: {
      cotisation: {
        association_label: associationLabel,
      },
      devise: "CDF",
    },
    _sum: {
      montant: true,
    },
  })

  return {
    totalDrivers,
    totalMoney: {
      USD: totalMoneyUSD._sum.montant || 0,
      CDF: totalMoneyCDF._sum.montant || 0,
    },
  }
}

/* const getStatsByProgram = async (programLabel) => {
  const totalAssociations = await prisma.association.count({
    where: {
      programme_label: programLabel,
    },
  })

  return {
    totalAssociations,
  }
} */

/* const getStatsByProgram = async (programLabel) => {
  // Fetch associations linked to the specific program label
  const associations = await prisma.association.findMany({
    where: {
      programme_label: programLabel,
    },
    select: {
      id: true,
      nom: true,
    },
  })

  const associationIds = associations.map((association) => association?.id)

  const associationNoms = associations.map((association) => association?.nom)

  // Count total associations linked to the program
  const totalAssociations = associationIds.length

  // Count total payments made by all associations linked to the program
 

  const totalMoneyUSD = await prisma.paiement.aggregate({
    where: {
      cotisation: {
        association_label: associationNoms,
      },
      devise: "usd",
    },
    _sum: {
      montant: true,
    },
  })

  const totalMoneyCDF = await prisma.paiement.aggregate({
    where: {
      cotisation: {
        association_label: associationNoms,
      },
      devise: "cfd",
    },
    _sum: {
      montant: true,
    },
  })

  // Count number of all drivers from all associations linked to the program
  const totalDrivers = await prisma.utilisateur.count({
    where: {
      profil_label: "Chauffeur",
      association: {
        nom: {
          in: associationNoms,
        },
      },
    },
  })
  console.log("totalDrivers", totalDrivers)
  return {
    totalAssociations,
    totalMoney: {
      USD: totalMoneyUSD._sum.montant,
      CDF: totalMoneyCDF._sum.montant,
    },
    totalDrivers,
  }

  const totalSuccursales = await prisma.succursale.count({
    where: {},
  })
}
 */
const getStatsByProgram = async (programLabel) => {
  try {
    // Fetch associations linked to the specific program label
    const associations = await prisma.association.findMany({
      where: {
        programme_label: programLabel,
      },
      select: {
        id: true,
        nom: true,
      },
    })

    const associationIds = associations.map((association) => association?.id)
    const associationNoms = associations.map((association) => association?.nom)

    // Count total associations linked to the program
    const totalAssociations = associationIds.length

    // Aggregate total payments in USD and CDF for associations linked to the program
    const totalMoneyUSD = await prisma.paiement.aggregate({
      where: {
        cotisation: {
          association_label: {
            in: associationNoms,
          },
        },
        devise: "USD",
      },
      _sum: {
        montant: true,
      },
    })

    const totalMoneyCDF = await prisma.paiement.aggregate({
      where: {
        cotisation: {
          association_label: {
            in: associationNoms,
          },
        },
        devise: "CDF",
      },
      _sum: {
        montant: true,
      },
    })

    // Count number of all drivers from all associations linked to the program
    const totalDrivers = await prisma.utilisateur.count({
      where: {
        profil_label: "Chauffeur",
        association: {
          nom: {
            in: associationNoms,
          },
        },
      },
    })

    // Count total succursales linked to associations in the program
    const totalSuccursales = await prisma.succursale.count({
      where: {
        association: {
          id: {
            in: associationIds,
          },
        },
      },
    })

    return {
      totalAssociations,
      totalMoney: {
        USD: totalMoneyUSD._sum.montant || 0,
        CDF: totalMoneyCDF._sum.montant || 0,
      },
      totalDrivers,
      totalSuccursales,
      associationNoms,
      associationIds,
    }
  } catch (error) {
    console.error("Error fetching statistics:", error)
    throw new Error("Unable to fetch program statistics.")
  }
}

const deletePendingPayments = async () => {
  return await prisma.paiement.deleteMany({
    where: {
      status: "PENDING",
      created_at: {
        lt: new Date(new Date() - 2 * 60 * 1000), // Optional: delete payments older than 2 minutes
      },
    },
  })
}

module.exports = {
  createAssociation,
  retrieveAssociations,
  retrieveAssociation,
  changeAssociation,
  removeAssociation,
  createProgram,
  retrievePrograms,
  retrieveProgram,
  retrieveProgramByAssociation,
  changeProgram,
  removeProgram,
  createAssociationBranch,
  retrieveAssociationBranches,
  retrieveAssociationBranch,
  changeAssociationBranch,
  removeAssociationBranch,
  createAssociationNotif,
  retrieveAssociationNotifs,
  retrieveAssociationNotif,
  changeAssociationNotif,
  removeAssociationNotif,
  createNotification,
  retrieveNotifications,
  retrieveNotification,
  changeNotification,
  removeNotification,
  createContribution,
  retrieveContribution,
  retrieveContributions,
  changeContribution,
  removeContribution,
  createPermission,
  retrievePermissions,
  retrievePermission,
  changePermission,
  removePermission,
  createContributionType,
  retrieveContributionTypes,
  retrieveContributionType,
  changeContributionType,
  removeContributionType,
  createUser,
  retrieveUsers,
  retrieveUser,
  changeUser,
  removeUser,
  findUserByMailOrPhone,
  createUserProfile,
  retrieveUserProfiles,
  retrieveUserProfile,
  changeUserProfile,
  removeUserProfile,
  createPayment,
  retrievePayments,
  retrievePayment,
  retrievePendingPayments,
  retrievePaymentByPeriodId,
  changePayment,
  removePayment,
  retrievePaymentsForDriver,
  findUserByMailOrPhone,
  updateUserPassword,
  find_UserByMailOrPhone,
  createSuccursale,
  getSuccursales,
  getSuccursaleById,
  updateSuccursale,
  deleteSuccursale,
  createSuccursale,
  getSuccursales,
  getSuccursaleById,
  updateSuccursale,
  deleteSuccursale,
  retrievePeriods,
  retrievePeriod,
  changePeriod,
  removePeriod,
  retrieveUnpaidPeriods,
  createPeriod,
  retrievePeriodsForCotisation,
  createVehicle,
  retrieveVehicles,
  retrieveVehicle,
  changeVehicle,
  removeVehicle,
  retrieveVehiclesForUser,
  getUsersByAssociation,
  getStats,
  getStatsByAssociation,
  getStatsByProgram,
  deletePendingPayments,
}
